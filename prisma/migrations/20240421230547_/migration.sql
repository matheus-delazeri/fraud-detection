-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "payment_method" TEXT NOT NULL,
    "product_category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "customer_local" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "is_fraudulent" INTEGER NOT NULL,
    "hour" INTEGER NOT NULL
);
