/*
  Warnings:

  - You are about to drop the column `user_id` on the `deposit` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `rekening` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `rekening` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `deposit` DROP FOREIGN KEY `deposit_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `rekening` DROP FOREIGN KEY `rekening_user_id_fkey`;

-- AlterTable
ALTER TABLE `deposit` DROP COLUMN `user_id`,
    ADD COLUMN `authorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `rekening` DROP COLUMN `user_id`,
    ADD COLUMN `authorId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `deposit` ADD CONSTRAINT `deposit_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rekening` ADD CONSTRAINT `rekening_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
