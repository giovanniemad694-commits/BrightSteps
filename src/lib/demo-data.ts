import type { Child, Task, Reward, TaskCompletion, RewardRedemption, AppNotification, Achievement, ChildAchievement, PointsTransaction, MoneyTransaction, Family, FamilySettings } from './types';

export const demoFamily: Family = {
  id: 'demo-family',
  name: 'Ahmed Family',
  created_by: 'demo',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const demoChildren: Child[] = [
  { id: 'adam', family_id: 'demo-family', name: 'Adam', nickname: null, avatar: '🦁', pin: null, age_group: 'primary', points: 120, money_balance: 25, screen_time_minutes: 45, xp: 260, level: 2, streak_days: 3, last_completion_date: null, created_at: '', updated_at: '' },
  { id: 'jana', family_id: 'demo-family', name: 'Jana', nickname: null, avatar: '🦄', pin: null, age_group: 'kg', points: 85, money_balance: 15, screen_time_minutes: 30, xp: 180, level: 2, streak_days: 5, last_completion_date: null, created_at: '', updated_at: '' },
];

export const demoTasks: Task[] = [
  { id: 't-bed', family_id: 'demo-family', child_id: 'adam', title: 'Make your bed', description: 'Start the day with a tidy room.', category: 'organization', frequency: 'daily', due_date: new Date().toISOString(), due_time: null, reward_type: 'points', reward_amount: 10, reward_unit: 'points', difficulty: 'easy', icon: '🛏️', color: 'blue', status: 'assigned', created_at: '', updated_at: '' },
  { id: 't-hw', family_id: 'demo-family', child_id: 'adam', title: 'Finish homework', description: 'Complete your school work before playtime.', category: 'homework', frequency: 'daily', due_date: new Date().toISOString(), due_time: '17:00', reward_type: 'points', reward_amount: 20, reward_unit: 'points', difficulty: 'medium', icon: '📚', color: 'amber', status: 'assigned', created_at: '', updated_at: '' },
  { id: 't-room', family_id: 'demo-family', child_id: 'adam', title: 'Clean your room', description: 'Put everything back in its place.', category: 'cleaning', frequency: 'weekly', due_date: new Date().toISOString(), due_time: null, reward_type: 'points', reward_amount: 30, reward_unit: 'points', difficulty: 'hard', icon: '🧽', color: 'green', status: 'assigned', created_at: '', updated_at: '' },
  { id: 't-read', family_id: 'demo-family', child_id: 'jana', title: 'Read for 20 minutes', description: 'Choose a story you love.', category: 'reading', frequency: 'daily', due_date: new Date().toISOString(), due_time: null, reward_type: 'points', reward_amount: 15, reward_unit: 'points', difficulty: 'easy', icon: '📖', color: 'pink', status: 'approved', created_at: '', updated_at: '' },
  { id: 't-dishes', family_id: 'demo-family', child_id: 'jana', title: 'Help with dishes', description: 'Help clear the table after dinner.', category: 'helping', frequency: 'daily', due_date: new Date().toISOString(), due_time: null, reward_type: 'points', reward_amount: 20, reward_unit: 'points', difficulty: 'medium', icon: '🍽️', color: 'teal', status: 'assigned', created_at: '', updated_at: '' },
];

export const demoRewards: Reward[] = [
  { id: 'r-ice', family_id: 'demo-family', name: 'Ice Cream', description: 'Pick your favorite flavor.', icon: '🍦', reward_type: 'points', cost: 50, cost_unit: 'points', availability: 'available', stock: null, created_at: '', updated_at: '' },
  { id: 'r-tv', family_id: 'demo-family', name: '30 Minutes TV', description: 'Choose a show for a special break.', icon: '📺', reward_type: 'points', cost: 30, cost_unit: 'points', availability: 'available', stock: null, created_at: '', updated_at: '' },
  { id: 'r-movie', family_id: 'demo-family', name: 'Movie Night', description: 'A cozy family movie night.', icon: '🎬', reward_type: 'points', cost: 100, cost_unit: 'points', availability: 'available', stock: null, created_at: '', updated_at: '' },
  { id: 'r-toy', family_id: 'demo-family', name: 'Small Toy', description: 'Choose a small surprise.', icon: '🧸', reward_type: 'points', cost: 200, cost_unit: 'points', availability: 'available', stock: null, created_at: '', updated_at: '' },
];

export const demoCompletions: TaskCompletion[] = [];
export const demoRedemptions: RewardRedemption[] = [];
export const demoNotifications: AppNotification[] = [];
export const demoPointsTransactions: PointsTransaction[] = [];
export const demoMoneyTransactions: MoneyTransaction[] = [];

export const demoAchievements: Achievement[] = [
  { id: 'a1', family_id: null, name: 'First Task', description: 'Complete your very first task', icon: '🏆', criteria: 'total_tasks', threshold: 1, created_at: '' },
  { id: 'a2', family_id: null, name: '10 Tasks Completed', description: 'Complete 10 tasks', icon: '🥇', criteria: 'total_tasks', threshold: 10, created_at: '' },
  { id: 'a3', family_id: null, name: '7-Day Consistency', description: 'Keep a 7-day streak going', icon: '🔥', criteria: 'streak', threshold: 7, created_at: '' },
  { id: 'a4', family_id: null, name: 'Homework Hero', description: 'Complete 5 homework tasks', icon: '📚', criteria: 'category_homework', threshold: 5, created_at: '' },
  { id: 'a5', family_id: null, name: 'Reading Star', description: 'Complete 5 reading tasks', icon: '📖', criteria: 'category_reading', threshold: 5, created_at: '' },
  { id: 'a6', family_id: null, name: 'Helpful Family Member', description: 'Complete 5 helping tasks', icon: '🤝', criteria: 'category_helping', threshold: 5, created_at: '' },
];

export const demoChildAchievements: ChildAchievement[] = [
  { id: 'ca1', child_id: 'adam', achievement_id: 'a1', family_id: 'demo-family', earned_at: new Date().toISOString(), created_at: '' },
  { id: 'ca2', child_id: 'adam', achievement_id: 'a2', family_id: 'demo-family', earned_at: new Date().toISOString(), created_at: '' },
];

export const demoSettings: FamilySettings = {
  id: 'demo-settings',
  family_id: 'demo-family',
  enable_points: true,
  enable_money: true,
  enable_screen_time: true,
  enable_custom_rewards: true,
  currency: 'EGP',
  language: 'en',
  notify_task_completion: true,
  notify_reward_request: true,
  parent_pin: null,
  created_at: '',
  updated_at: '',
};
