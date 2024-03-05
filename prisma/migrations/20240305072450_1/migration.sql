/*
  Warnings:

  - You are about to drop the column `amount` on the `deposit` table. All the data in the column will be lost.
  - You are about to drop the column `deposit` on the `deposit` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nominal_deposit` to the `deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proof_transaction` to the `deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_bank` to the `deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_bank` to the `deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `deposit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deposit` DROP COLUMN `amount`,
    DROP COLUMN `deposit`,
    ADD COLUMN `authorId` INTEGER NOT NULL,
    ADD COLUMN `nominal_deposit` INTEGER NOT NULL,
    ADD COLUMN `proof_transaction` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipient_bank` INTEGER NOT NULL,
    ADD COLUMN `sender_bank` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `admin`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rekening` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `no_rekening` VARCHAR(191) NOT NULL,
    `bank` VARCHAR(191) NOT NULL,
    `authorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `deposit` ADD CONSTRAINT `deposit_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rekening` ADD CONSTRAINT `rekening_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
