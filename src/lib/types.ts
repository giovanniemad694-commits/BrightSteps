export type AgeGroup = 'kg' | 'primary' | 'prep';

export type TaskFrequency = 'daily' | 'weekly' | 'one_time';

export type RewardType = 'points' | 'money' | 'screen_time' | 'custom';

export type TaskStatus = 'assigned' | 'in_progress' | 'completed' | 'approved' | 'rejected' | 'expired';

export type CompletionStatus = 'pending' | 'approved' | 'rejected';

export type RedemptionStatus = 'pending' | 'approved' | 'rejected';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type TaskCategory =
  | 'hygiene'
  | 'homework'
  | 'reading'
  | 'cleaning'
  | 'helping'
  | 'organization'
  | 'other';

export interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  family_id: string;
  name: string;
  nickname: string | null;
  avatar: string;
  pin: string | null;
  age_group: AgeGroup;
  points: number;
  money_balance: number;
  screen_time_minutes: number;
  xp: number;
  level: number;
  streak_days: number;
  last_completion_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  family_id: string;
  child_id: string | null;
  title: string;
  description: string | null;
  category: TaskCategory;
  frequency: TaskFrequency;
  due_date: string | null;
  due_time: string | null;
  reward_type: RewardType;
  reward_amount: number;
  reward_unit: string;
  difficulty: Difficulty;
  icon: string;
  color: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface TaskCompletion {
  id: string;
  task_id: string;
  child_id: string;
  family_id: string;
  status: CompletionStatus;
  completed_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
  created_at: string;
  task?: Task;
  child?: Child;
}

export interface Reward {
  id: string;
  family_id: string;
  name: string;
  description: string | null;
  icon: string;
  reward_type: RewardType;
  cost: number;
  cost_unit: string;
  availability: string;
  stock: number | null;
  created_at: string;
  updated_at: string;
}

export interface RewardRedemption {
  id: string;
  reward_id: string;
  child_id: string;
  family_id: string;
  status: RedemptionStatus;
  redeemed_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
  created_at: string;
  reward?: Reward;
  child?: Child;
}

export interface PointsTransaction {
  id: string;
  family_id: string;
  child_id: string;
  amount: number;
  reason: string;
  task_id: string | null;
  redemption_id: string | null;
  created_at: string;
}

export interface MoneyTransaction {
  id: string;
  family_id: string;
  child_id: string;
  amount: number;
  reason: string;
  task_id: string | null;
  redemption_id: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  family_id: string | null;
  name: string;
  description: string | null;
  icon: string;
  criteria: string;
  threshold: number;
  created_at: string;
}

export interface ChildAchievement {
  id: string;
  child_id: string;
  achievement_id: string;
  family_id: string;
  earned_at: string;
  created_at: string;
  achievement?: Achievement;
}

export interface AppNotification {
  id: string;
  family_id: string;
  child_id: string | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface FamilySettings {
  id: string;
  family_id: string;
  enable_points: boolean;
  enable_money: boolean;
  enable_screen_time: boolean;
  enable_custom_rewards: boolean;
  currency: string;
  language: string;
  notify_task_completion: boolean;
  notify_reward_request: boolean;
  parent_pin: string | null;
  created_at: string;
  updated_at: string;
}
