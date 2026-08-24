-- Security hardening is intentionally additive. Existing data remains readable
-- while the application moves sensitive payloads to encrypted columns.
ALTER TYPE "EmailDeliveryStatus" ADD VALUE IF NOT EXISTS 'PROCESSING';
ALTER TYPE "EmailDeliveryStatus" ADD VALUE IF NOT EXISTS 'DEAD_LETTER';

CREATE TYPE "AppointmentProposalSide" AS ENUM ('CLIENT', 'FIRM');

ALTER TABLE "AppointmentProposal"
  ADD COLUMN "proposerSide" "AppointmentProposalSide";

UPDATE "AppointmentProposal" AS proposal
SET "proposerSide" = CASE
  WHEN proposal."proposedById" IS NULL THEN 'CLIENT'::"AppointmentProposalSide"
  WHEN EXISTS (
    SELECT 1
    FROM "User" AS proposer
    WHERE proposer."id" = proposal."proposedById"
      AND proposer."role" = 'CLIENT'
  ) THEN 'CLIENT'::"AppointmentProposalSide"
  ELSE 'FIRM'::"AppointmentProposalSide"
END;

ALTER TABLE "AppointmentProposal"
  ALTER COLUMN "proposerSide" SET NOT NULL;

ALTER TABLE "User"
  ADD COLUMN "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "mfaSecretEncrypted" TEXT,
  ADD COLUMN "mfaPendingEncrypted" TEXT,
  ADD COLUMN "mfaEnrolledAt" TIMESTAMP(3);

CREATE TABLE "MfaRecoveryCode" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MfaRecoveryCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MfaRecoveryCode_codeHash_key" ON "MfaRecoveryCode"("codeHash");
CREATE INDEX "MfaRecoveryCode_userId_usedAt_idx" ON "MfaRecoveryCode"("userId", "usedAt");
ALTER TABLE "MfaRecoveryCode"
  ADD CONSTRAINT "MfaRecoveryCode_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "UserSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "ipHash" TEXT,
  "userAgent" TEXT,
  CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "UserSession_userId_revokedAt_lastSeenAt_idx"
  ON "UserSession"("userId", "revokedAt", "lastSeenAt");
CREATE INDEX "UserSession_expiresAt_idx" ON "UserSession"("expiresAt");
ALTER TABLE "UserSession"
  ADD CONSTRAINT "UserSession_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Document"
  ADD COLUMN "checksumSha256" TEXT,
  ADD COLUMN "scanProvider" TEXT,
  ADD COLUMN "scanError" TEXT,
  ADD COLUMN "scannedAt" TIMESTAMP(3),
  ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "Document_scanStatus_createdAt_idx" ON "Document"("scanStatus", "createdAt");
CREATE INDEX "Document_deletedAt_idx" ON "Document"("deletedAt");

ALTER TABLE "Appointment" ADD COLUMN "manageTokenExpiresAt" TIMESTAMP(3);
UPDATE "Appointment"
SET "manageTokenExpiresAt" = "createdAt" + INTERVAL '30 days'
WHERE "manageTokenExpiresAt" IS NULL;
CREATE INDEX "Appointment_manageTokenExpiresAt_idx"
  ON "Appointment"("manageTokenExpiresAt");

ALTER TABLE "Appointment"
  ADD COLUMN "calendarSyncAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "calendarSyncLockedAt" TIMESTAMP(3),
  ADD COLUMN "calendarSyncLockedBy" TEXT;
CREATE INDEX "Appointment_calendarSyncStatus_calendarSyncLockedAt_updatedAt_idx"
  ON "Appointment"("calendarSyncStatus", "calendarSyncLockedAt", "updatedAt");

ALTER TABLE "Message" ADD COLUMN "idempotencyKey" TEXT;
CREATE UNIQUE INDEX "Message_idempotencyKey_key" ON "Message"("idempotencyKey");

ALTER TABLE "Notification" ADD COLUMN "dedupeKey" TEXT;
CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON "Notification"("dedupeKey");

ALTER TABLE "AuditLog"
  ADD COLUMN "requestId" TEXT,
  ADD COLUMN "ipHash" TEXT,
  ADD COLUMN "userAgent" TEXT;
CREATE INDEX "AuditLog_requestId_idx" ON "AuditLog"("requestId");

ALTER TABLE "EmailOutbox"
  ALTER COLUMN "payload" DROP NOT NULL,
  ADD COLUMN "encryptedPayload" TEXT,
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "nextAttemptAt" TIMESTAMP(3),
  ADD COLUMN "lockedAt" TIMESTAMP(3),
  ADD COLUMN "lockedBy" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "EmailOutbox_idempotencyKey_key" ON "EmailOutbox"("idempotencyKey");
CREATE INDEX "EmailOutbox_status_nextAttemptAt_createdAt_idx"
  ON "EmailOutbox"("status", "nextAttemptAt", "createdAt");
