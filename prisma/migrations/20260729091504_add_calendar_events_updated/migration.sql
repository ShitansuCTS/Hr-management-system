/*
  Warnings:

  - You are about to drop the column `color` on the `CalendarEvent` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `CalendarEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CalendarEvent" DROP COLUMN "color",
DROP COLUMN "location";
