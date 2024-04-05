-- CreateTable
CREATE TABLE `organization_subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `org_id` VARCHAR(191) NOT NULL,
    `stripe_customer_id` VARCHAR(191) NULL,
    `stripe_subscription_id` VARCHAR(191) NULL,
    `stripe_price_id` VARCHAR(191) NULL,
    `stripe_current_period_end` DATETIME(3) NULL,

    UNIQUE INDEX `organization_subscriptions_org_id_key`(`org_id`),
    UNIQUE INDEX `organization_subscriptions_stripe_customer_id_key`(`stripe_customer_id`),
    UNIQUE INDEX `organization_subscriptions_stripe_subscription_id_key`(`stripe_subscription_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
