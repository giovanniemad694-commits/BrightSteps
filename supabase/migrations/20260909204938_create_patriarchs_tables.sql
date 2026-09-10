/*
# Create Coptic Patriarchs Archive — Tables & RLS

Creates the database schema for an educational archive of Coptic Orthodox Patriarchs.

## Tables
1. `patriarchs` — main biographies and metadata
2. `patriarch_events` — historical events per patriarch
3. `patriarch_sources` — references/sources per patriarch

## Security (RLS)
- Public SELECT (anon + authenticated) on all tables — public educational archive
- INSERT/UPDATE/DELETE restricted to authenticated users (admin area)
*/

-- ============================================================
-- 1. PATRIARCHS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS patriarchs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  papal_number integer NOT NULL,
  birth_date text,
  death_date text,
  papacy_start text,
  papacy_end text,
  century integer NOT NULL,
  short_bio_ar text NOT NULL,
  biography_ar text NOT NULL,
  historical_background_ar text,
  faith_defense_ar text,
  challenges_ar text,
  contributions_ar text,
  image_url text,
  image_source text,
  image_credit text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_patriarchs_papal_number ON patriarchs(papal_number);
CREATE INDEX IF NOT EXISTS idx_patriarchs_century ON patriarchs(century);

ALTER TABLE patriarchs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_patriarchs" ON patriarchs;
CREATE POLICY "public_select_patriarchs" ON patriarchs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_patriarchs" ON patriarchs;
CREATE POLICY "admin_insert_patriarchs" ON patriarchs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_patriarchs" ON patriarchs;
CREATE POLICY "admin_update_patriarchs" ON patriarchs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_patriarchs" ON patriarchs;
CREATE POLICY "admin_delete_patriarchs" ON patriarchs FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 2. PATRIARCH_EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS patriarch_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patriarch_id uuid NOT NULL REFERENCES patriarchs(id) ON DELETE CASCADE,
  title_ar text NOT NULL,
  description_ar text,
  event_date text,
  event_year integer,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_patriarch_id ON patriarch_events(patriarch_id);

ALTER TABLE patriarch_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_events" ON patriarch_events;
CREATE POLICY "public_select_events" ON patriarch_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_events" ON patriarch_events;
CREATE POLICY "admin_insert_events" ON patriarch_events FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_events" ON patriarch_events;
CREATE POLICY "admin_update_events" ON patriarch_events FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_events" ON patriarch_events;
CREATE POLICY "admin_delete_events" ON patriarch_events FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 3. PATRIARCH_SOURCES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS patriarch_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patriarch_id uuid NOT NULL REFERENCES patriarchs(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text,
  source_type text DEFAULT 'book',
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sources_patriarch_id ON patriarch_sources(patriarch_id);

ALTER TABLE patriarch_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_sources" ON patriarch_sources;
CREATE POLICY "public_select_sources" ON patriarch_sources FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_sources" ON patriarch_sources;
CREATE POLICY "admin_insert_sources" ON patriarch_sources FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_sources" ON patriarch_sources;
CREATE POLICY "admin_update_sources" ON patriarch_sources FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_sources" ON patriarch_sources;
CREATE POLICY "admin_delete_sources" ON patriarch_sources FOR DELETE
  TO authenticated USING (true);
