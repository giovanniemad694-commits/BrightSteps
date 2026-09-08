/*
# Add server-side approval functions and seed achievements

## Overview
This migration adds two SECURITY DEFINER functions that handle task approval and reward redemption approval atomically on the server side. It also seeds default achievements that are available to all families.

## New Functions
1. **approve_task_completion(p_completion_id uuid)**
   - Updates task_completions status to 'approved'
   - Updates the associated task status to 'approved'
   - Awards points/XP/money/screen_time to the child based on the task's reward_type
   - Creates a points_transaction or money_transaction audit record
   - Creates a notification for the child
   - Updates the child's streak if applicable

2. **approve_reward_redemption(p_redemption_id uuid)**
   - Updates reward_redemptions status to 'approved'
   - Deducts the reward cost from the child's points balance
   - Creates a points_transaction audit record
   - Creates a notification for the child

## Seeded Data
- 6 default achievements (family_id = NULL, available to all families):
  - First Task, 10 Tasks Completed, 7-Day Consistency, Homework Hero, Reading Star, Helpful Family Member

## Security
- Both functions are SECURITY DEFINER so they can update child balances (which children cannot do directly via RLS)
- Both functions verify the caller owns the family before proceeding
- EXECUTE granted to authenticated role
*/

-- ============ APPROVE TASK COMPLETION ============
CREATE OR REPLACE FUNCTION approve_task_completion(p_completion_id uuid)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  v_completion task_completions%ROWTYPE;
  v_task tasks%ROWTYPE;
  v_child children%ROWTYPE;
  v_family_id uuid;
  v_owner uuid;
BEGIN
  -- Get the completion and verify ownership
  SELECT * INTO v_completion FROM task_completions WHERE id = p_completion_id;
  IF NOT FOUND THEN RETURN; END IF;

  SELECT created_by INTO v_owner FROM families WHERE id = v_completion.family_id;
  IF v_owner IS DISTINCT FROM auth.uid() THEN RETURN; END IF;

  -- Get the task and child
  SELECT * INTO v_task FROM tasks WHERE id = v_completion.task_id;
  SELECT * INTO v_child FROM children WHERE id = v_completion.child_id;

  -- Update completion status
  UPDATE task_completions
    SET status = 'approved', reviewed_at = now(), reviewed_by = auth.uid()
    WHERE id = p_completion_id;

  -- Update task status
  UPDATE tasks SET status = 'approved' WHERE id = v_completion.task_id;

  -- Award based on reward type
  IF v_task.reward_type = 'points' THEN
    UPDATE children
      SET points = points + v_task.reward_amount,
          xp = xp + v_task.reward_amount
      WHERE id = v_completion.child_id;

    INSERT INTO points_transactions (family_id, child_id, amount, reason, task_id)
      VALUES (v_completion.family_id, v_completion.child_id, v_task.reward_amount, 'Task: ' || v_task.title, v_completion.task_id);

  ELSIF v_task.reward_type = 'money' THEN
    UPDATE children
      SET money_balance = money_balance + v_task.reward_amount,
          xp = xp + v_task.reward_amount
      WHERE id = v_completion.child_id;

    INSERT INTO money_transactions (family_id, child_id, amount, reason, task_id)
      VALUES (v_completion.family_id, v_completion.child_id, v_task.reward_amount, 'Task: ' || v_task.title, v_completion.task_id);

  ELSIF v_task.reward_type = 'screen_time' THEN
    UPDATE children
      SET screen_time_minutes = screen_time_minutes + v_task.reward_amount,
          xp = xp + v_task.reward_amount
      WHERE id = v_completion.child_id;

  ELSE
    -- custom reward: just XP
    UPDATE children SET xp = xp + v_task.reward_amount WHERE id = v_completion.child_id;
  END IF;

  -- Update streak
  IF v_child.last_completion_date IS NULL OR v_child.last_completion_date < CURRENT_DATE THEN
    UPDATE children
      SET streak_days = streak_days + 1,
          last_completion_date = CURRENT_DATE
      WHERE id = v_completion.child_id;
  END IF;

  -- Notify child
  INSERT INTO notifications (family_id, child_id, type, title, message)
    VALUES (
      v_completion.family_id,
      v_completion.child_id,
      'task_approved',
      'Task Approved!',
      'Your task "' || v_task.title || '" was approved! +' || v_task.reward_amount || ' ' || v_task.reward_unit
    );
END;
$$;

GRANT EXECUTE ON FUNCTION approve_task_completion(uuid) TO authenticated;

-- ============ REJECT TASK COMPLETION ============
CREATE OR REPLACE FUNCTION reject_task_completion(p_completion_id uuid, p_reason text DEFAULT NULL)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  v_completion task_completions%ROWTYPE;
  v_task tasks%ROWTYPE;
  v_owner uuid;
BEGIN
  SELECT * INTO v_completion FROM task_completions WHERE id = p_completion_id;
  IF NOT FOUND THEN RETURN; END IF;

  SELECT created_by INTO v_owner FROM families WHERE id = v_completion.family_id;
  IF v_owner IS DISTINCT FROM auth.uid() THEN RETURN; END IF;

  SELECT * INTO v_task FROM tasks WHERE id = v_completion.task_id;

  UPDATE task_completions
    SET status = 'rejected', reviewed_at = now(), reviewed_by = auth.uid(), rejection_reason = p_reason
    WHERE id = p_completion_id;

  UPDATE tasks SET status = 'assigned' WHERE id = v_completion.task_id;

  INSERT INTO notifications (family_id, child_id, type, title, message)
    VALUES (
      v_completion.family_id,
      v_completion.child_id,
      'task_rejected',
      'Task Needs Revision',
      'Your task "' || v_task.title || '" needs another try. You can do it!'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION reject_task_completion(uuid, text) TO authenticated;

-- ============ APPROVE REWARD REDEMPTION ============
CREATE OR REPLACE FUNCTION approve_reward_redemption(p_redemption_id uuid)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  v_redemption reward_redemptions%ROWTYPE;
  v_reward rewards%ROWTYPE;
  v_owner uuid;
BEGIN
  SELECT * INTO v_redemption FROM reward_redemptions WHERE id = p_redemption_id;
  IF NOT FOUND THEN RETURN; END IF;

  SELECT created_by INTO v_owner FROM families WHERE id = v_redemption.family_id;
  IF v_owner IS DISTINCT FROM auth.uid() THEN RETURN; END IF;

  SELECT * INTO v_reward FROM rewards WHERE id = v_redemption.reward_id;

  -- Update redemption status
  UPDATE reward_redemptions
    SET status = 'approved', reviewed_at = now(), reviewed_by = auth.uid()
    WHERE id = p_redemption_id;

  -- Deduct points from child
  UPDATE children
    SET points = GREATEST(0, points - v_reward.cost)
    WHERE id = v_redemption.child_id;

  -- Record transaction
  INSERT INTO points_transactions (family_id, child_id, amount, reason, redemption_id)
    VALUES (
      v_redemption.family_id,
      v_redemption.child_id,
      -v_reward.cost,
      'Reward: ' || v_reward.name,
      v_redemption.id
    );

  -- Notify child
  INSERT INTO notifications (family_id, child_id, type, title, message)
    VALUES (
      v_redemption.family_id,
      v_redemption.child_id,
      'reward_approved',
      'Reward Approved!',
      'Your reward "' || v_reward.name || '" was approved! Enjoy!'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION approve_reward_redemption(uuid) TO authenticated;

-- ============ REJECT REWARD REDEMPTION ============
CREATE OR REPLACE FUNCTION reject_reward_redemption(p_redemption_id uuid, p_reason text DEFAULT NULL)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  v_redemption reward_redemptions%ROWTYPE;
  v_reward rewards%ROWTYPE;
  v_owner uuid;
BEGIN
  SELECT * INTO v_redemption FROM reward_redemptions WHERE id = p_redemption_id;
  IF NOT FOUND THEN RETURN; END IF;

  SELECT created_by INTO v_owner FROM families WHERE id = v_redemption.family_id;
  IF v_owner IS DISTINCT FROM auth.uid() THEN RETURN; END IF;

  SELECT * INTO v_reward FROM rewards WHERE id = v_redemption.reward_id;

  UPDATE reward_redemptions
    SET status = 'rejected', reviewed_at = now(), reviewed_by = auth.uid(), rejection_reason = p_reason
    WHERE id = p_redemption_id;

  INSERT INTO notifications (family_id, child_id, type, title, message)
    VALUES (
      v_redemption.family_id,
      v_redemption.child_id,
      'reward_rejected',
      'Reward Request Update',
      'Your reward "' || v_reward.name || '" was not approved this time. Keep saving your points!'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION reject_reward_redemption(uuid, text) TO authenticated;

-- ============ SEED DEFAULT ACHIEVEMENTS ============
INSERT INTO achievements (family_id, name, description, icon, criteria, threshold)
VALUES
  (NULL, 'First Task', 'Complete your very first task', '🏆', 'total_tasks', 1),
  (NULL, '10 Tasks Completed', 'Complete 10 tasks', '🥇', 'total_tasks', 10),
  (NULL, '7-Day Consistency', 'Keep a 7-day streak going', '🔥', 'streak', 7),
  (NULL, 'Homework Hero', 'Complete 5 homework tasks', '📚', 'category_homework', 5),
  (NULL, 'Reading Star', 'Complete 5 reading tasks', '📖', 'category_reading', 5),
  (NULL, 'Helpful Family Member', 'Complete 5 helping tasks', '🤝', 'category_helping', 5)
ON CONFLICT DO NOTHING;

-- ============ SEED SCREEN TIME TRANSACTIONS TABLE ============
CREATE TABLE IF NOT EXISTS screen_time_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  reason text NOT NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  redemption_id uuid REFERENCES reward_redemptions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE screen_time_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_family_screen_time" ON screen_time_transactions;
CREATE POLICY "select_family_screen_time" ON screen_time_transactions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = screen_time_transactions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_family_screen_time" ON screen_time_transactions;
CREATE POLICY "insert_family_screen_time" ON screen_time_transactions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM families WHERE families.id = screen_time_transactions.family_id AND families.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_family_screen_time" ON screen_time_transactions;
CREATE POLICY "delete_family_screen_time" ON screen_time_transactions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM families WHERE families.id = screen_time_transactions.family_id AND families.created_by = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_screen_time_transactions_child_id ON screen_time_transactions(child_id);
