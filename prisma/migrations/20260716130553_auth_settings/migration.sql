/*
  Warnings:

  - You are about to drop the `AboutTimelineItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `AdminUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminSession" ADD COLUMN "userAgent" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "driveUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "thumbnailUrl" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AboutTimelineItem";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AboutContent" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "title" TEXT NOT NULL DEFAULT 'The Journey',
    "titleHighlight" TEXT NOT NULL DEFAULT 'So Far',
    "description" TEXT NOT NULL DEFAULT 'I am a creative director...',
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "tools" TEXT NOT NULL DEFAULT 'Premiere Pro, After Effects, Photoshop, Blender',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AdminUser" ("createdAt", "id", "passwordHash", "updatedAt", "username") SELECT "createdAt", "id", "passwordHash", "updatedAt", "username" FROM "AdminUser";
DROP TABLE "AdminUser";
ALTER TABLE "new_AdminUser" RENAME TO "AdminUser";
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE TABLE "new_AppearanceSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "mode" TEXT NOT NULL DEFAULT 'dark',
    "accent" TEXT NOT NULL DEFAULT '#00D084',
    "accentSoft" TEXT NOT NULL DEFAULT '#00FF9D',
    "background" TEXT NOT NULL DEFAULT '#0B0B0B',
    "particleCount" INTEGER NOT NULL DEFAULT 600,
    "gridOpacity" REAL NOT NULL DEFAULT 0.15,
    "glowIntensity" REAL NOT NULL DEFAULT 1,
    "showShowreel" BOOLEAN NOT NULL DEFAULT true,
    "showServices" BOOLEAN NOT NULL DEFAULT true,
    "showProjects" BOOLEAN NOT NULL DEFAULT true,
    "showBeforeAfter" BOOLEAN NOT NULL DEFAULT true,
    "showWorkflow" BOOLEAN NOT NULL DEFAULT true,
    "showSkills" BOOLEAN NOT NULL DEFAULT true,
    "showAbout" BOOLEAN NOT NULL DEFAULT true,
    "showTestimonials" BOOLEAN NOT NULL DEFAULT true,
    "showContact" BOOLEAN NOT NULL DEFAULT true,
    "orderProjects" INTEGER NOT NULL DEFAULT 1,
    "orderSkills" INTEGER NOT NULL DEFAULT 2,
    "orderAbout" INTEGER NOT NULL DEFAULT 3,
    "orderContact" INTEGER NOT NULL DEFAULT 4,
    "customLogoUrl" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AppearanceSettings" ("accent", "accentSoft", "background", "glowIntensity", "gridOpacity", "id", "mode", "particleCount", "updatedAt") SELECT "accent", "accentSoft", "background", "glowIntensity", "gridOpacity", "id", "mode", "particleCount", "updatedAt" FROM "AppearanceSettings";
DROP TABLE "AppearanceSettings";
ALTER TABLE "new_AppearanceSettings" RENAME TO "AppearanceSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_tokenHash_idx" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
