-- CreateEnum
CREATE TYPE "LawyerRank" AS ENUM ('PARTNER', 'ASSOCIATE');

-- CreateEnum
CREATE TYPE "MatterPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "AppointmentProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'SUPERSEDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AppointmentHoldStatus" AS ENUM ('ACTIVE', 'CONFIRMED', 'RELEASED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ArticleReviewDecision" AS ENUM ('SUBMITTED', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ArticleBlockType" AS ENUM ('HEADING_2', 'HEADING_3', 'PARAGRAPH', 'LIST', 'QUOTE', 'CALLOUT', 'IMAGE', 'DIVIDER', 'TABLE', 'LINK', 'NOTE', 'CONCLUSION');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('ARTICLE_HERO', 'ARTICLE_INLINE', 'LAWYER_PROFILE', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PROCESSING', 'READY', 'REJECTED', 'ARCHIVED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MatterAssignmentRole" ADD VALUE 'LEAD_LAWYER';
ALTER TYPE "MatterAssignmentRole" ADD VALUE 'SUPERVISING_PARTNER';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Visibility" ADD VALUE 'CLIENT_VISIBLE';
ALTER TYPE "Visibility" ADD VALUE 'INTERNAL_ONLY';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AppointmentStatus" ADD VALUE 'LAWYER_REVIEW';
ALTER TYPE "AppointmentStatus" ADD VALUE 'CLIENT_REVIEW';
ALTER TYPE "AppointmentStatus" ADD VALUE 'PROPOSED_BY_LAWYER';
ALTER TYPE "AppointmentStatus" ADD VALUE 'PROPOSED_BY_CLIENT';
ALTER TYPE "AppointmentStatus" ADD VALUE 'DECLINED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ArticleStatus" ADD VALUE 'SUBMITTED';
ALTER TYPE "ArticleStatus" ADD VALUE 'CHANGES_REQUESTED';
ALTER TYPE "ArticleStatus" ADD VALUE 'APPROVED';
ALTER TYPE "ArticleStatus" ADD VALUE 'REJECTED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'NEW_MESSAGE';
ALTER TYPE "NotificationType" ADD VALUE 'APPOINTMENT_REQUEST';
ALTER TYPE "NotificationType" ADD VALUE 'APPOINTMENT_PROPOSAL';
ALTER TYPE "NotificationType" ADD VALUE 'APPOINTMENT_CONFIRMED';
ALTER TYPE "NotificationType" ADD VALUE 'APPOINTMENT_CANCELLED';
ALTER TYPE "NotificationType" ADD VALUE 'ARTICLE_SUBMITTED';
ALTER TYPE "NotificationType" ADD VALUE 'ARTICLE_CHANGES_REQUESTED';
ALTER TYPE "NotificationType" ADD VALUE 'ARTICLE_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE 'ARTICLE_PUBLISHED';
ALTER TYPE "NotificationType" ADD VALUE 'ACCOUNT_INVITE';
ALTER TYPE "NotificationType" ADD VALUE 'EMAIL_FAILED';

-- DropIndex
DROP INDEX "LawyerProfile_active_sortOrder_idx";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LawyerProfile" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "rank" "LawyerRank" NOT NULL DEFAULT 'ASSOCIATE',
ADD COLUMN     "supervisorId" TEXT;

-- AlterTable
ALTER TABLE "Matter" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "practiceAreaId" TEXT,
ADD COLUMN     "priority" "MatterPriority" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "MatterUpdate" ADD COLUMN     "effectiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emailOutboxId" TEXT,
ADD COLUMN     "nextAction" TEXT,
ADD COLUMN     "nextActionAt" TIMESTAMP(3),
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "relatedStage" "MatterStage",
ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "acceptedById" TEXT,
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "confirmedEndAt" TIMESTAMP(3),
ADD COLUMN     "confirmedStartAt" TIMESTAMP(3),
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "declinedAt" TIMESTAMP(3),
ADD COLUMN     "durationMinutes" INTEGER NOT NULL DEFAULT 45,
ADD COLUMN     "icsSequence" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "icsUid" TEXT,
ADD COLUMN     "lastActorId" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "meetingUrl" TEXT,
ADD COLUMN     "proposedEndAt" TIMESTAMP(3),
ADD COLUMN     "proposedStartAt" TIMESTAMP(3),
ADD COLUMN     "visibleNotes" TEXT;

-- Backfill stable calendar identifiers before applying the required constraint.
UPDATE "Appointment"
SET "icsUid" = 'xs-' || md5("id" || clock_timestamp()::text || random()::text)
WHERE "icsUid" IS NULL;

ALTER TABLE "Appointment" ALTER COLUMN "icsUid" SET NOT NULL;

-- Preserve the current public hierarchy when introducing professional ranks.
UPDATE "LawyerProfile"
SET "rank" = 'PARTNER'
WHERE lower("position") LIKE 'socio%';

-- AlterTable
ALTER TABLE "AvailabilityRule" ADD COLUMN     "bookingHorizonDays" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "dailyLimit" INTEGER,
ADD COLUMN     "minimumNoticeMinutes" INTEGER NOT NULL DEFAULT 1440,
ADD COLUMN     "modalities" "AppointmentModality"[] DEFAULT ARRAY['IN_PERSON', 'VIDEO_CALL', 'PHONE_CALL']::"AppointmentModality"[];

ALTER TABLE "Matter" ALTER COLUMN "tags" SET NOT NULL;
ALTER TABLE "AvailabilityRule" ALTER COLUMN "modalities" SET NOT NULL;

-- AlterTable
ALTER TABLE "BlockedTime" ADD COLUMN     "allDay" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "editedAt" TIMESTAMP(3),
ADD COLUMN     "notificationSentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "conclusion" TEXT,
ADD COLUMN     "heroMediaId" TEXT,
ADD COLUMN     "introduction" TEXT,
ADD COLUMN     "legalNotice" TEXT,
ADD COLUMN     "ogDescription" TEXT,
ADD COLUMN     "ogTitle" TEXT,
ADD COLUMN     "references" JSONB,
ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "Article" ALTER COLUMN "tags" SET NOT NULL;

-- AlterTable
ALTER TABLE "ActionToken" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "lastSentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "EmailOutbox" ADD COLUMN     "failedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AppointmentProposal" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "proposedById" TEXT,
    "lawyerId" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "modality" "AppointmentModality" NOT NULL,
    "location" TEXT,
    "meetingUrl" TEXT,
    "message" TEXT,
    "status" "AppointmentProposalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "AppointmentProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentHold" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "proposalId" TEXT,
    "lawyerId" TEXT,
    "resourceKey" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentHoldStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentHold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LawyerAvailabilityOverride" (
    "id" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "startMinutes" INTEGER,
    "endMinutes" INTEGER,
    "durationMinutes" INTEGER,
    "bufferMinutes" INTEGER,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LawyerAvailabilityOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleCoauthor" (
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ArticleCoauthor_pkey" PRIMARY KEY ("articleId","userId")
);

-- CreateTable
CREATE TABLE "ArticleRevision" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "metadata" JSONB,
    "createdById" TEXT NOT NULL,
    "changeSummary" TEXT,
    "reviewStatus" "ArticleStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleReview" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "decision" "ArticleReviewDecision" NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleBlock" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "type" "ArticleBlockType" NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'PROCESSING',
    "storageKey" TEXT NOT NULL,
    "deliveryUrl" TEXT,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "altText" TEXT NOT NULL,
    "caption" TEXT,
    "checksum" TEXT NOT NULL,
    "variants" JSONB,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentProposal_appointmentId_status_createdAt_idx" ON "AppointmentProposal"("appointmentId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "AppointmentProposal_proposedById_createdAt_idx" ON "AppointmentProposal"("proposedById", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentHold_proposalId_key" ON "AppointmentHold"("proposalId");

-- CreateIndex
CREATE INDEX "AppointmentHold_expiresAt_status_idx" ON "AppointmentHold"("expiresAt", "status");

-- CreateIndex
CREATE INDEX "AppointmentHold_appointmentId_status_idx" ON "AppointmentHold"("appointmentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentHold_resourceKey_startsAt_key" ON "AppointmentHold"("resourceKey", "startsAt");

-- CreateIndex
CREATE INDEX "LawyerAvailabilityOverride_date_available_idx" ON "LawyerAvailabilityOverride"("date", "available");

-- CreateIndex
CREATE UNIQUE INDEX "LawyerAvailabilityOverride_lawyerId_date_key" ON "LawyerAvailabilityOverride"("lawyerId", "date");

-- CreateIndex
CREATE INDEX "ArticleCoauthor_userId_sortOrder_idx" ON "ArticleCoauthor"("userId", "sortOrder");

-- CreateIndex
CREATE INDEX "ArticleRevision_createdById_createdAt_idx" ON "ArticleRevision"("createdById", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleRevision_articleId_version_key" ON "ArticleRevision"("articleId", "version");

-- CreateIndex
CREATE INDEX "ArticleReview_articleId_createdAt_idx" ON "ArticleReview"("articleId", "createdAt");

-- CreateIndex
CREATE INDEX "ArticleReview_reviewerId_decision_createdAt_idx" ON "ArticleReview"("reviewerId", "decision", "createdAt");

-- CreateIndex
CREATE INDEX "ArticleBlock_createdById_updatedAt_idx" ON "ArticleBlock"("createdById", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleBlock_articleId_sortOrder_key" ON "ArticleBlock"("articleId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_storageKey_key" ON "MediaAsset"("storageKey");

-- CreateIndex
CREATE INDEX "MediaAsset_type_status_createdAt_idx" ON "MediaAsset"("type", "status", "createdAt");

-- CreateIndex
CREATE INDEX "MediaAsset_uploadedById_createdAt_idx" ON "MediaAsset"("uploadedById", "createdAt");

-- CreateIndex
CREATE INDEX "LawyerProfile_active_rank_sortOrder_idx" ON "LawyerProfile"("active", "rank", "sortOrder");

-- CreateIndex
CREATE INDEX "LawyerProfile_supervisorId_idx" ON "LawyerProfile"("supervisorId");

-- CreateIndex
CREATE INDEX "Matter_practiceAreaId_priority_idx" ON "Matter"("practiceAreaId", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_icsUid_key" ON "Appointment"("icsUid");

-- AddForeignKey
ALTER TABLE "LawyerProfile" ADD CONSTRAINT "LawyerProfile_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "LawyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matter" ADD CONSTRAINT "Matter_practiceAreaId_fkey" FOREIGN KEY ("practiceAreaId") REFERENCES "PracticeArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatterUpdate" ADD CONSTRAINT "MatterUpdate_emailOutboxId_fkey" FOREIGN KEY ("emailOutboxId") REFERENCES "EmailOutbox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_lastActorId_fkey" FOREIGN KEY ("lastActorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentProposal" ADD CONSTRAINT "AppointmentProposal_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentProposal" ADD CONSTRAINT "AppointmentProposal_proposedById_fkey" FOREIGN KEY ("proposedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentProposal" ADD CONSTRAINT "AppointmentProposal_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "LawyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentHold" ADD CONSTRAINT "AppointmentHold_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentHold" ADD CONSTRAINT "AppointmentHold_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "AppointmentProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentHold" ADD CONSTRAINT "AppointmentHold_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "LawyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LawyerAvailabilityOverride" ADD CONSTRAINT "LawyerAvailabilityOverride_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "LawyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_heroMediaId_fkey" FOREIGN KEY ("heroMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCoauthor" ADD CONSTRAINT "ArticleCoauthor_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCoauthor" ADD CONSTRAINT "ArticleCoauthor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRevision" ADD CONSTRAINT "ArticleRevision_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRevision" ADD CONSTRAINT "ArticleRevision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleReview" ADD CONSTRAINT "ArticleReview_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleReview" ADD CONSTRAINT "ArticleReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleBlock" ADD CONSTRAINT "ArticleBlock_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleBlock" ADD CONSTRAINT "ArticleBlock_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionToken" ADD CONSTRAINT "ActionToken_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
