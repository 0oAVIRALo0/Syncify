/*
  Warnings:

  - You are about to drop the column `artists` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `followers` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Tokens` table. All the data in the column will be lost.
  - You are about to drop the column `display_name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spotifyId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "artists",
DROP COLUMN "followers",
ADD COLUMN     "spotifyFollowers" INTEGER DEFAULT 0,
ALTER COLUMN "isPremium" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tokens" DROP COLUMN "expiresAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "display_name",
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON "FriendRequest"("senderId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "User_spotifyId_key" ON "User"("spotifyId");

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
