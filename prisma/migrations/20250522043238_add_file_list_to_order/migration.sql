-- AlterTable
ALTER TABLE `order` ADD COLUMN `contractFileList` JSON NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatarFile` VARCHAR(191) NULL;
