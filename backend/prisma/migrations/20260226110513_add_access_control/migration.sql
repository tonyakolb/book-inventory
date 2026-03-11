-- CreateTable
CREATE TABLE "InventoryAccess" (
    "id" SERIAL NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "InventoryAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InventoryAccess_inventoryId_userId_key" ON "InventoryAccess"("inventoryId", "userId");

-- AddForeignKey
ALTER TABLE "InventoryAccess" ADD CONSTRAINT "InventoryAccess_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAccess" ADD CONSTRAINT "InventoryAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
