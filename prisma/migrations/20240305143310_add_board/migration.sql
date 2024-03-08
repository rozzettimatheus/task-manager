-- CreateTable
CREATE TABLE `boards` (
    `id` VARCHAR(191) NOT NULL,
    `org_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `image_id` VARCHAR(191) NOT NULL,
    `image_thumb_url` TEXT NOT NULL,
    `image_full_url` TEXT NOT NULL,
    `image_username` TEXT NOT NULL,
    `image_link_html` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
