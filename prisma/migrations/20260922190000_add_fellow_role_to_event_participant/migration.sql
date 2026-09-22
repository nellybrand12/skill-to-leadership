-- Migration: add_fellow_role_to_event_participant
-- Apply this SQL against your Supabase database (Dashboard → SQL Editor, or psql).
--
-- What this does:
--   1. Adds the nullable `fellowRole` column to "EventParticipant".
--      This stores "what they do / role / focus area" for FELLOW-category entries.
--      NULL for existing and future ENTREPRENEUR entries.
--   2. Sets a default of '' on businessName so FELLOW inserts (no business name)
--      don't require a non-null value.
--
-- Safe to run on a live database:
--   - ADD COLUMN with a default is metadata-only in PostgreSQL 11+ (no table rewrite).
--   - No existing row data is affected.

ALTER TABLE "EventParticipant"
  ADD COLUMN IF NOT EXISTS "fellowRole" TEXT;

ALTER TABLE "EventParticipant"
  ALTER COLUMN "businessName" SET DEFAULT '';
