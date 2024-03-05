/*
  Warnings:

  - You are about to drop the column `authorId` on the `deposit` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `rekening` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `rekening` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `deposit` DROP FOREIGN KEY `deposit_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `rekening` DROP FOREIGN KEY `rekening_authorId_fkey`;

-- AlterTable
ALTER TABLE `deposit` DROP COLUMN `authorId`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `rekening` DROP COLUMN `authorId`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `deposit` ADD CONSTRAINT `deposit_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rekening` ADD CONSTRAINT `rekening_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
