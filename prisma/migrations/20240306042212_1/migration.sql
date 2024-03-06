/*
  Warnings:

  - You are about to alter the column `sender_bank` on the `deposit` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `deposit` MODIFY `sender_bank` INTEGER NOT NULL;
