-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "emailSignature" TEXT,
ADD COLUMN     "notificationPreferences" JSONB;
