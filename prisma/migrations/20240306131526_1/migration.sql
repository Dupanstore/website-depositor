-- DropForeignKey
ALTER TABLE `deposit` DROP FOREIGN KEY `deposit_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `rekening` DROP FOREIGN KEY `rekening_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `deposit` ADD CONSTRAINT `deposit_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rekening` ADD CONSTRAINT `rekening_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
