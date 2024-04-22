import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()
const transactionsFilePath = process.cwd() + '/prisma/data/transactions.json'

async function seedDatabase() {
  try {
    const data = fs.readFileSync(transactionsFilePath, 'utf-8')
    const transactions = JSON.parse(data)

    await prisma.transaction.createMany({
      data: transactions,
    })

    console.log('Transactions added successfully')
  } catch (error) {
    console.error('Error adding transactions:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
