/*
# Family Rewards App - Core Schema

## Overview
Creates the complete database schema for a family task/rewards app where parents create tasks for children, children complete tasks to earn rewards (points, money, screen time, custom), and parents approve completions and reward redemptions.

## New Tables

1. **families** - Top-level family group (e.g., "Ahmed Family")
   - id (uuid PK), name (text), created_by (uuid FK auth.users), created_at, updated_at

2. **children** - Child profiles within a family
   - id (uuid PK), family_id (uuid FK), name (text), nickname (text), avatar (text), pin (text - hashed), age_group (text), points (int default 0), money_balance (numeric default 0), screen_time_minutes (int default 0), xp (int default 0), level (int default 1), streak_days (int default 0), last_completion_date (date), created_at, updated_at

3. **tasks** - Tasks/chores created by parents
   - id (uuid PK), family_id (uuid FK), child_id (uuid FK nullable), title (text), description (text), category (text), frequency (text: daily/weekly/one_time), due_date (date), due_time (text), reward_type (text: points/money/screen_time/custom), reward_amount (numeric), reward_unit (text), difficulty (text: easy/medium/hard), icon (text), color (text), status (text), created_at, updated_at

4. **task_completions** - Records of child completing a task
   - id (uuid PK), task_id (uuid FK), child_id (uuid FK), status (text: pending/approved/rejected), completed_at, reviewed_at, reviewed_by (uuid), rejection_reason (text), created_at

5. **rewards** - Rewards in the family reward store
   - id (uuid PK), family_id (uuid FK), name (text), description (text), icon (text), reward_type (text: points/money/screen_time/custom), cost (numeric), cost_unit (text), availability (text: available/limited), stock (int), created_at, updated_at

6. **reward_redemptions** - Child requests to redeem a reward
   - id (uuid PK), reward_id (uuid FK), child_id (uuid FK), family_id (uuid FK), status (text: pending/approved/rejected), redeemed_at, reviewed_at, reviewed_by (uuid), rejection_reason (text), created_at

7. **points_transactions** - Audit log for all point changes
   - id (uuid PK), family_id (uuid FK), child_id (uuid FK), amount (int), reason (text), task_id (uuid FK nullable), redemption_id (uuid FK nullable), created_at

8. **money_transactions** - Audit log for all money balance changes
   - id (uuid PK), family_id (uuid FK), child_id (uuid FK), amount (numeric), reason (text), task_id (uuid FK nullable), redemption_id (uuid FK nullable), created_at

9. **achievements** - Achievement definitions
   - id (uuid PK), family_id (uuid FK nullable), name (text), description (text), icon (text), criteria (text), threshold (int), created_at

10. **child_achievements** - Achievements earned by children
    - id (uuid PK), child_id (uuid FK), achievement_id (uuid FK), earned_at, created_at

11. **notifications** - In-app notifications
    - id (uuid PK), family_id (uuid FK), child_id (uuid FK nullable), type (text), title (text), message (text), is_read (bool default false), created_at

12. **family_settings** - Per-family configuration
    - id (uuid PK), family_id (uuid FK unique), enable_points (bool default true), enable_money (bool default true), enable_screen_time (bool default true), enable_custom_rewards (bool default true), currency (text default 'EGP'), language (text default 'en'), notify_task_completion (bool default true), notify_reward_request (bool default true), parent_pin (text), created_at, updated_at

## Security
- RLS enabled on ALL tables
- All policies scoped to authenticated users who own the family (via families.created_by = auth.uid())
- Child PIN access is handled at the application layer with a child-specific session
- 4 policies per table (SELECT/INSERT/UPDATE/DELETE)
*/

-- ============ FAMILIES ============
CREATE TABLE IF NOT EXISTS families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE families ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_family" ON families;
CREATE POLICY "select_own_family" ON families FOR SELECT
  TO authenticated USING (created_by = auth.uid());

DROP POLICY IF EXISTS "insert_own_family" ON families;
CREATE POLICY "insert_own_family" ON families FOR INSERT
  TO authenticated WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "update_own_family" ON families;
CREATE POLICY "update_own_family" ON families FOR UPDATE
  TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "delete_own_family" ON families;
CREATE POLICY "delete_own_family" ON families FOR DELETE
  TO authenticated USING (created_by = auth.uid());

-- ============ CHILDREN ============
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name text NOT NULL,
  nickname text,
  avatar text DEFAULT '🦁',
  pin text,
  age_group text DEFAULT 'primary',
  points integer NOT NULL DEFAULT 0,
  money_balance numeric(10,2) NOT NULL DEFAULT 0,
  screen_time_minutes integer NOT NULL DEFAULT 0,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  streak_days integer NOT NULL DEFAULT 0,
  last_completion_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_family_children" ON children;
CREATE POLICY "select_family_children" ON children FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = children.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_family_children" ON children;
CREATE POLICY "insert_family_children" ON children FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = children.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "update_family_children" ON children;
CREATE POLICY "update_family_children" ON children FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = children.family_id AND families.created_by = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = children.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_family_children" ON children;
CREATE POLICY "delete_family_children" ON children FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = children.family_id AND families.created_by = auth.uid())
  );

-- ============ TASKS ============
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text DEFAULT 'general',
  frequency text NOT NULL DEFAULT 'daily',
  due_date date,
  due_time text,
  reward_type text NOT NULL DEFAULT 'points',
  reward_amount numeric(10,2) NOT NULL DEFAULT 0,
  reward_unit text DEFAULT 'points',
  difficulty text DEFAULT 'easy',
  icon text DEFAULT '✅',
  color text DEFAULT 'blue',
  status text NOT NULL DEFAULT 'assigned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_family_tasks" ON tasks;
CREATE POLICY "select_family_tasks" ON tasks FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = tasks.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_family_tasks" ON tasks;
CREATE POLICY "insert_family_tasks" ON tasks FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = tasks.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "update_family_tasks" ON tasks;
CREATE POLICY "update_family_tasks" ON tasks FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = tasks.family_id AND families.created_by = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = tasks.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_family_tasks" ON tasks;
CREATE POLICY "delete_family_tasks" ON tasks FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = tasks.family_id AND families.created_by = auth.uid())
  );

-- ============ TASK COMPLETIONS ============
CREATE TABLE IF NOT EXISTS task_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  completed_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  rejection_reason text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_family_completions" ON task_completions;
CREATE POLICY "select_family_completions" ON task_completions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = task_completions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_family_completions" ON task_completions;
CREATE POLICY "insert_family_completions" ON task_completions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = task_completions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "update_family_completions" ON task_completions;
CREATE POLICY "update_family_completions" ON task_completions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = task_completions.family_id AND families.created_by = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = task_completions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_family_completions" ON task_completions;
CREATE POLICY "delete_family_completions" ON task_completions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = task_completions.family_id AND families.created_by = auth.uid())
  );

-- ============ REWARDS ============
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  icon text DEFAULT '🎁',
  reward_type text NOT NULL DEFAULT 'custom',
  cost numeric(10,2) NOT NULL DEFAULT 0,
  cost_unit text DEFAULT 'points',
  availability text DEFAULT 'available',
  stock integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_family_rewards" ON rewards;
CREATE POLICY "select_family_rewards" ON rewards FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = rewards.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_family_rewards" ON rewards;
CREATE POLICY "insert_family_rewards" ON rewards FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = rewards.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "update_family_rewards" ON rewards;
CREATE POLICY "update_family_rewards" ON rewards FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = rewards.family_id AND families.created_by = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = rewards.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_family_rewards" ON rewards;
CREATE POLICY "delete_family_rewards" ON rewards FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = rewards.family_id AND families.created_by = auth.uid())
  );

-- ============ REWARD REDEMPTIONS ============
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id uuid NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  redeemed_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  rejection_reason text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_family_redemptions" ON reward_redemptions;
CREATE POLICY "select_family_redemptions" ON reward_redemptions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = reward_redemptions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_family_redemptions" ON reward_redemptions;
CREATE POLICY "insert_family_redemptions" ON reward_redemptions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = reward_redemptions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "update_family_redemptions" ON reward_redemptions;
CREATE POLICY "update_family_redemptions" ON reward_redemptions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = reward_redemptions.family_id AND families.created_by = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = reward_redemptions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_family_redemptions" ON reward_redemptions;
CREATE POLICY "delete_family_redemptions" ON reward_redemptions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = reward_redemptions.family_id AND families.created_by = auth.uid())
  );

-- ============ POINTS TRANSACTIONS ============
CREATE TABLE IF NOT EXISTS points_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  reason text NOT NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  redemption_id uuid REFERENCES reward_redemptions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_family_points" ON points_transactions;
CREATE POLICY "select_family_points" ON points_transactions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = points_transactions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_family_points" ON points_transactions;
CREATE POLICY "insert_family_points" ON points_transactions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = points_transactions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_family_points" ON points_transactions;
CREATE POLICY "delete_family_points" ON points_transactions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = points_transactions.family_id AND families.created_by = auth.uid())
  );

-- ============ MONEY TRANSACTIONS ============
CREATE TABLE IF NOT EXISTS money_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  reason text NOT NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  redemption_id uuid REFERENCES reward_redemptions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE money_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_family_money" ON money_transactions;
CREATE POLICY "select_family_money" ON money_transactions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = money_transactions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_family_money" ON money_transactions;
CREATE POLICY "insert_family_money" ON money_transactions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = money_transactions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_family_money" ON money_transactions;
CREATE POLICY "delete_family_money" ON money_transactions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = money_transactions.family_id AND families.created_by = auth.uid())
  );

-- ============ ACHIEVEMENTS ============
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid REFERENCES families(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  icon text DEFAULT '🏆',
  criteria text NOT NULL,
  threshold integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_family_achievements" ON achievements;
CREATE POLICY "select_family_achievements" ON achievements FOR SELECT
  TO authenticated USING (
    family_id IS NULL OR EXISTS (SELECT 1 FROM families WHERE families.id = achievements.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_family_achievements" ON achievements;
CREATE POLICY "insert_family_achievements" ON achievements FOR INSERT
  TO authenticated WITH CHECK (
    family_id IS NULL OR EXISTS (SELECT 1 FROM families WHERE families.id = achievements.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_family_achievements" ON achievements;
CREATE POLICY "delete_family_achievements" ON achievements FOR DELETE
  TO authenticated USING (
    family_id IS NULL OR EXISTS (SELECT 1 FROM families WHERE families.id = achievements.family_id AND families.created_by = auth.uid())
  );

-- ============ CHILD ACHIEVEMENTS ============
CREATE TABLE IF NOT EXISTS child_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(child_id, achievement_id)
);
ALTER TABLE child_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_family_child_achievements" ON child_achievements;
CREATE POLICY "select_family_child_achievements" ON child_achievements FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = child_achievements.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_family_child_achievements" ON child_achievements;
CREATE POLICY "insert_family_child_achievements" ON child_achievements FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = child_achievements.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_family_child_achievements" ON child_achievements;
CREATE POLICY "delete_family_child_achievements" ON child_achievements FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = child_achievements.family_id AND families.created_by = auth.uid())
  );

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_family_notifications" ON notifications;
CREATE POLICY "select_family_notifications" ON notifications FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = notifications.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_family_notifications" ON notifications;
CREATE POLICY "insert_family_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = notifications.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "update_family_notifications" ON notifications;
CREATE POLICY "update_family_notifications" ON notifications FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = notifications.family_id AND families.created_by = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = notifications.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_family_notifications" ON notifications;
CREATE POLICY "delete_family_notifications" ON notifications FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = notifications.family_id AND families.created_by = auth.uid())
  );

-- ============ FAMILY SETTINGS ============
CREATE TABLE IF NOT EXISTS family_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL UNIQUE REFERENCES families(id) ON DELETE CASCADE,
  enable_points boolean NOT NULL DEFAULT true,
  enable_money boolean NOT NULL DEFAULT true,
  enable_screen_time boolean NOT NULL DEFAULT true,
  enable_custom_rewards boolean NOT NULL DEFAULT true,
  currency text NOT NULL DEFAULT 'EGP',
  language text NOT NULL DEFAULT 'en',
  notify_task_completion boolean NOT NULL DEFAULT true,
  notify_reward_request boolean NOT NULL DEFAULT true,
  parent_pin text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE family_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_family_settings" ON family_settings;
CREATE POLICY "select_own_family_settings" ON family_settings FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = family_settings.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_family_settings" ON family_settings;
CREATE POLICY "insert_own_family_settings" ON family_settings FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = family_settings.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_family_settings" ON family_settings;
CREATE POLICY "update_own_family_settings" ON family_settings FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = family_settings.family_id AND families.created_by = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = family_settings.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_family_settings" ON family_settings;
CREATE POLICY "delete_own_family_settings" ON family_settings FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = family_settings.family_id AND families.created_by = auth.uid())
  );

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_children_family_id ON children(family_id);
CREATE INDEX IF NOT EXISTS idx_tasks_family_id ON tasks(family_id);
CREATE INDEX IF NOT EXISTS idx_tasks_child_id ON tasks(child_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_family_id ON task_completions(family_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_child_id ON task_completions(child_id);
CREATE INDEX IF NOT EXISTS idx_rewards_family_id ON rewards(family_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_family_id ON reward_redemptions(family_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_family_id ON points_transactions(family_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_child_id ON points_transactions(child_id);
CREATE INDEX IF NOT EXISTS idx_money_transactions_family_id ON money_transactions(family_id);
CREATE INDEX IF NOT EXISTS idx_money_transactions_child_id ON money_transactions(child_id);
CREATE INDEX IF NOT EXISTS idx_notifications_family_id ON notifications(family_id);
CREATE INDEX IF NOT EXISTS idx_child_achievements_child_id ON child_achievements(child_id);

-- ============ UPDATED_AT TRIGGER ============
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_families_updated_at ON families;
CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_children_updated_at ON children;
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rewards_updated_at ON rewards;
CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_family_settings_updated_at ON family_settings;
CREATE TRIGGER update_family_settings_updated_at BEFORE UPDATE ON family_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();