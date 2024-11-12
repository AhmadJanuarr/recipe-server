/*
  Warnings:

  - Made the column `stepsId` on table `recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `recipe` MODIFY `stepsId` INTEGER NOT NULL;
