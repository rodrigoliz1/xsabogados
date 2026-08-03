-- Track the most recent transactional email delivery attempt.
ALTER TABLE "EmailOutbox" ADD COLUMN "lastAttemptAt" TIMESTAMP(3);
