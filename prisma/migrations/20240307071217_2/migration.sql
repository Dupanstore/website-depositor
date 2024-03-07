/*
  Warnings:

  - Added the required column `recipient_name` to the `deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_rekening` to the `deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_name` to the `deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_rekening` to the `deposit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deposit` ADD COLUMN `recipient_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipient_rekening` VARCHAR(191) NOT NULL,
    ADD COLUMN `sender_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `sender_rekening` VARCHAR(191) NOT NULL,
    MODIFY `sender_bank` VARCHAR(191) NOT NULL,
    MODIFY `recipient_bank` VARCHAR(191) NOT NULL;
