/*
  Warnings:

  - Made the column `bang` on table `durability` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `durability` MODIFY `bang` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `percentage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
