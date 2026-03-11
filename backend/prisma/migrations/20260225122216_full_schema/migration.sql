-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_createdById_fkey";

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "customBool1Name" TEXT,
ADD COLUMN     "customBool1State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customBool2Name" TEXT,
ADD COLUMN     "customBool2State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customBool3Name" TEXT,
ADD COLUMN     "customBool3State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customInt1Name" TEXT,
ADD COLUMN     "customInt1State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customInt2Name" TEXT,
ADD COLUMN     "customInt2State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customInt3Name" TEXT,
ADD COLUMN     "customInt3State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customString1Name" TEXT,
ADD COLUMN     "customString1State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customString2Name" TEXT,
ADD COLUMN     "customString2State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customString3Name" TEXT,
ADD COLUMN     "customString3State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "customBool1" BOOLEAN,
ADD COLUMN     "customBool2" BOOLEAN,
ADD COLUMN     "customBool3" BOOLEAN,
ADD COLUMN     "customInt1" INTEGER,
ADD COLUMN     "customInt2" INTEGER,
ADD COLUMN     "customInt3" INTEGER,
ADD COLUMN     "customString1" TEXT,
ADD COLUMN     "customString2" TEXT,
ADD COLUMN     "customString3" TEXT;

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "inventoryId" INTEGER,
    "itemId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_itemId_key" ON "Like"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
