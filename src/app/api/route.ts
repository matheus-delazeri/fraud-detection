import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

interface FraudRequestBody {
  amount: number
  payment_method: string
  product_category: string
  quantity: number
  customer_local: string
  device: string
  ip: string
}

export async function POST(req: Request) {
  try {
    const body: FraudRequestBody = await req.json()

    const predictFraudProbability = async (
      data: FraudRequestBody,
    ): Promise<number> => {
      let totalWeights = 0
      let totalFraudWeights = 0
      const fraudFactor = 1000

      const columnWeights: Record<string, number> = {
        amount: 1.0,
        payment_method: 1.5,
        product_category: 1.0,
        quantity: 0.5,
        customer_local: 1.0,
        device: 1.0,
        ip: 5.0,
      }

      const calculateWeights = async (
        column: string,
        value: string | number,
      ) => {
        const similarTransactionsCount = await prisma.transaction.count({
          where: {
            [column]: value,
          },
        })

        const fraudulentTransactionsCount = await prisma.transaction.count({
          where: {
            [column]: value,
            is_fraudulent: 1,
          },
        })

        if (similarTransactionsCount > 0) {
          const weight = similarTransactionsCount
          const fraudWeight =
            fraudulentTransactionsCount * columnWeights[column] * fraudFactor

          totalWeights += weight
          totalFraudWeights += fraudWeight
        }
      }

      await calculateWeights('amount', data.amount)
      await calculateWeights('payment_method', data.payment_method)
      await calculateWeights('product_category', data.product_category)
      await calculateWeights('quantity', data.quantity)
      await calculateWeights('customer_local', data.customer_local)
      await calculateWeights('device', data.device)
      await calculateWeights('ip', data.ip)

      let probabilityOfFraud = 0
      if (totalWeights > 0) {
        probabilityOfFraud = totalFraudWeights / totalWeights
      }

      return probabilityOfFraud
    }

    const probabilityOfFraud = await predictFraudProbability(body)

    return NextResponse.json({ probability: probabilityOfFraud })
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}
