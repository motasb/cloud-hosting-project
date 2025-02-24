/*
  Warnings:

  - Made the column `photoId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "photoId" SET NOT NULL,
ALTER COLUMN "photoId" DROP DEFAULT;
