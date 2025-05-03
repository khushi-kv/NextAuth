/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('READ_USERS', 'WRITE_USERS', 'READ_PRODUCTS', 'WRITE_PRODUCTS', 'MANAGE_ORDERS', 'VIEW_ANALYTICS', 'MANAGE_SETTINGS');

-- RenameEnum
ALTER TYPE "Role" RENAME TO "UserRole";

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- Create default roles
INSERT INTO "Role" ("id", "name", "createdAt", "updatedAt")
VALUES 
('admin_role', 'ADMIN', NOW(), NOW()),
('user_role', 'USER', NOW(), NOW()),
('vendor_role', 'VENDOR', NOW(), NOW()),
('support_role', 'SUPPORT', NOW(), NOW());

-- Add roleId to User table
ALTER TABLE "User" ADD COLUMN "roleId" TEXT;

-- Set default roles for existing users
UPDATE "User" SET "roleId" = 
  CASE "role"
    WHEN 'ADMIN' THEN 'admin_role'
    WHEN 'USER' THEN 'user_role'
    WHEN 'VENDOR' THEN 'vendor_role'
    WHEN 'SUPPORT' THEN 'support_role'
  END;

-- Make roleId required and add foreign key
ALTER TABLE "User" ALTER COLUMN "roleId" SET NOT NULL;
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop old role column
ALTER TABLE "User" DROP COLUMN "role";
