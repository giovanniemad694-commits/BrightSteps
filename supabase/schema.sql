-- ============================================================
-- Coptic Patriarchs Archive — Complete Database Schema
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New Query).
-- This file recreates the entire database structure from scratch.
-- ============================================================

-- ============================================================
-- 1. PATRIARCHS TABLE
-- Stores the main biography data for each patriarch
-- ============================================================
CREATE TABLE IF NOT EXISTS patriarchs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,             -- Arabic name
  name_en text NOT NULL,             -- English name
  papal_number integer NOT NULL,     -- Papal order number (1 = Saint Mark)
  birth_date text,                   -- Birth date (text allows approximate dates)
  death_date text,                   -- Death/Resting date
  papacy_start text,                 -- Start of papacy
  papacy_end text,                   -- End of papacy
  century integer NOT NULL,          -- Century number (e.g., 4 for 4th century)
  short_bio_ar text NOT NULL,        -- Short Arabic biography for cards
  biography_ar text NOT NULL,        -- Full Arabic biography
  historical_background_ar text,     -- Historical context
  faith_defense_ar text,             -- How he preserved the faith
  challenges_ar text,                -- Challenges faced
  contributions_ar text,             -- Major contributions
  image_url text,                    -- URL to portrait image
  image_source text,                 -- Where the image came from
  image_credit text,                 -- Image credit/attribution
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_patriarchs_papal_number ON patriarchs(papal_number);
CREATE INDEX IF NOT EXISTS idx_patriarchs_century ON patriarchs(century);

-- Row Level Security
ALTER TABLE patriarchs ENABLE ROW LEVEL SECURITY;

-- Public can read, only authenticated (admin) can write
DROP POLICY IF EXISTS "public_select_patriarchs" ON patriarchs;
CREATE POLICY "public_select_patriarchs"
  ON patriarchs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_patriarchs" ON patriarchs;
CREATE POLICY "admin_insert_patriarchs"
  ON patriarchs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_patriarchs" ON patriarchs;
CREATE POLICY "admin_update_patriarchs"
  ON patriarchs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_patriarchs" ON patriarchs;
CREATE POLICY "admin_delete_patriarchs"
  ON patriarchs FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 2. PATRIARCH_EVENTS TABLE
-- Important historical events for each patriarch
-- ============================================================
CREATE TABLE IF NOT EXISTS patriarch_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patriarch_id uuid NOT NULL REFERENCES patriarchs(id) ON DELETE CASCADE,
  title_ar text NOT NULL,            -- Event title (Arabic)
  description_ar text,               -- Event description
  event_date text,                   -- Date as text (e.g., "325 م")
  event_year integer,                -- Year as number for sorting
  sort_order integer DEFAULT 0,      -- Order in timeline
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_patriarch_id ON patriarch_events(patriarch_id);

ALTER TABLE patriarch_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_events" ON patriarch_events;
CREATE POLICY "public_select_events"
  ON patriarch_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_events" ON patriarch_events;
CREATE POLICY "admin_insert_events"
  ON patriarch_events FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_events" ON patriarch_events;
CREATE POLICY "admin_update_events"
  ON patriarch_events FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_events" ON patriarch_events;
CREATE POLICY "admin_delete_events"
  ON patriarch_events FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 3. PATRIARCH_SOURCES TABLE
-- References and sources for each patriarch
-- ============================================================
CREATE TABLE IF NOT EXISTS patriarch_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patriarch_id uuid NOT NULL REFERENCES patriarchs(id) ON DELETE CASCADE,
  title text NOT NULL,               -- Source title
  url text,                          -- Optional URL
  source_type text DEFAULT 'book',   -- 'book', 'document', or 'website'
  description text,                  -- Optional description
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sources_patriarch_id ON patriarch_sources(patriarch_id);

ALTER TABLE patriarch_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_sources" ON patriarch_sources;
CREATE POLICY "public_select_sources"
  ON patriarch_sources FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_sources" ON patriarch_sources;
CREATE POLICY "admin_insert_sources"
  ON patriarch_sources FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_sources" ON patriarch_sources;
CREATE POLICY "admin_update_sources"
  ON patriarch_sources FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_sources" ON patriarch_sources;
CREATE POLICY "admin_delete_sources"
  ON patriarch_sources FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- SECURITY: Revoke write grants from anon role
-- Only authenticated users (admins) can INSERT/UPDATE/DELETE
-- ============================================================
REVOKE INSERT, UPDATE, DELETE ON patriarchs FROM anon;
REVOKE INSERT, UPDATE, DELETE ON patriarch_events FROM anon;
REVOKE INSERT, UPDATE, DELETE ON patriarch_sources FROM anon;

-- ============================================================
-- DONE! The database is ready.
-- To add an admin user, go to Supabase Dashboard →
-- Authentication → Users → Add User.
-- ============================================================
