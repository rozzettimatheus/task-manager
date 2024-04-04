/*
  Warnings:

  - Added the required column `entity_title` to the `audit_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `audit_logs` ADD COLUMN `entity_title` VARCHAR(191) NOT NULL;
