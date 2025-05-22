-- CreateTable
CREATE TABLE `GoodFactory` (
    `id` VARCHAR(191) NOT NULL,
    `goodId` VARCHAR(191) NOT NULL,
    `factoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GoodFactory_goodId_factoryId_key`(`goodId`, `factoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GoodFactory` ADD CONSTRAINT `GoodFactory_goodId_fkey` FOREIGN KEY (`goodId`) REFERENCES `good`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodFactory` ADD CONSTRAINT `GoodFactory_factoryId_fkey` FOREIGN KEY (`factoryId`) REFERENCES `factory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
