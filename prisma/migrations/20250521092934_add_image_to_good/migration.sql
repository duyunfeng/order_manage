/*
  Warnings:

  - You are about to drop the column `category` on the `good` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `good` DROP COLUMN `category`,
    ADD COLUMN `image` VARCHAR(191) NULL;
