-- Add fields present in the Prisma schema but missing from the existing initial migration.
-- IF NOT EXISTS keeps this additive migration safe if a column was added manually.
ALTER TABLE "ProjectImage"
  ADD COLUMN IF NOT EXISTS "secureUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "publicId" TEXT,
  ADD COLUMN IF NOT EXISTS "filename" TEXT,
  ADD COLUMN IF NOT EXISTS "originalFilename" TEXT,
  ADD COLUMN IF NOT EXISTS "source" TEXT NOT NULL DEFAULT 'JK_INTERIOR',
  ADD COLUMN IF NOT EXISTS "isConcept" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Lead"
  ADD COLUMN IF NOT EXISTS "internalNotes" TEXT,
  ADD COLUMN IF NOT EXISTS "lastContactedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "nextFollowUpAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "utmSource" TEXT,
  ADD COLUMN IF NOT EXISTS "utmMedium" TEXT,
  ADD COLUMN IF NOT EXISTS "utmCampaign" TEXT,
  ADD COLUMN IF NOT EXISTS "utmTerm" TEXT,
  ADD COLUMN IF NOT EXISTS "utmContent" TEXT,
  ADD COLUMN IF NOT EXISTS "landingPage" TEXT;

ALTER TABLE "Media"
  ADD COLUMN IF NOT EXISTS "secureUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "originalFilename" TEXT,
  ADD COLUMN IF NOT EXISTS "format" TEXT,
  ADD COLUMN IF NOT EXISTS "source" TEXT NOT NULL DEFAULT 'JK_INTERIOR',
  ADD COLUMN IF NOT EXISTS "isConcept" BOOLEAN NOT NULL DEFAULT false;
