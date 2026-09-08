import type { TaskCategory, Difficulty, AgeGroup, RewardType } from './types';

export const TASK_ICONS: Record<string, string> = {
  '🛏️': 'Bed',
  '🪥': 'Brush Teeth',
  '📚': 'Homework',
  '📖': 'Reading',
  '🧹': 'Cleaning',
  '🍽️': 'Dishes',
  '🎒': 'School Bag',
  '🧽': 'Clean Room',
  '📝': 'Project',
  '🤝': 'Helping',
  '🚿': 'Shower',
  '👕': 'Laundry',
  '🥗': 'Cooking',
  '🌱': 'Garden',
  '🐾': 'Pet Care',
  '✅': 'General',
};

export const REWARD_ICONS: Record<string, string> = {
  '🍦': 'Ice Cream',
  '🎮': 'PlayStation',
  '📺': 'TV Time',
  '🎁': 'Gift',
  '🎬': 'Movie Night',
  '🚗': 'Trip',
  '🍕': 'Choose Dinner',
  '📖': 'Extra Story',
  '🧸': 'Toy',
  '🍫': 'Chocolate',
  '🎈': 'Balloon',
  '🏆': 'Trophy',
};

export const AVATAR_OPTIONS = [
  '🦁', '🐱', '🐶', '🐰', '🐻', '🦊', '🐼', '🐨',
  '🐸', '🐵', '🦄', '🐯', '🦝', '🐹', '🐷', '🦉',
];

export const TASK_CATEGORIES: { value: TaskCategory; labelKey: string; icon: string }[] = [
  { value: 'hygiene', labelKey: 'cat_hygiene', icon: '🪥' },
  { value: 'homework', labelKey: 'cat_homework', icon: '📚' },
  { value: 'reading', labelKey: 'cat_reading', icon: '📖' },
  { value: 'cleaning', labelKey: 'cat_cleaning', icon: '🧹' },
  { value: 'helping', labelKey: 'cat_helping', icon: '🤝' },
  { value: 'organization', labelKey: 'cat_organization', icon: '🗂️' },
  { value: 'other', labelKey: 'cat_other', icon: '✅' },
];

export const DIFFICULTIES: { value: Difficulty; labelKey: string; color: string }[] = [
  { value: 'easy', labelKey: 'diff_easy', color: 'green' },
  { value: 'medium', labelKey: 'diff_medium', color: 'amber' },
  { value: 'hard', labelKey: 'diff_hard', color: 'red' },
];

export const AGE_GROUPS: { value: AgeGroup; labelKey: string; icon: string }[] = [
  { value: 'kg', labelKey: 'age_kg', icon: '🧒' },
  { value: 'primary', labelKey: 'age_primary', icon: '👦' },
  { value: 'prep', labelKey: 'age_prep', icon: '🧑' },
];

export const REWARD_TYPES: { value: RewardType; labelKey: string; icon: string }[] = [
  { value: 'points', labelKey: 'rt_points', icon: '⭐' },
  { value: 'money', labelKey: 'rt_money', icon: '💰' },
  { value: 'screen_time', labelKey: 'rt_screen_time', icon: '📺' },
  { value: 'custom', labelKey: 'rt_custom', icon: '🎁' },
];

export const TASK_COLORS = [
  'blue', 'green', 'amber', 'red', 'purple', 'pink', 'teal', 'orange', 'indigo', 'cyan',
];

export interface LevelInfo {
  level: number;
  name: string;
  minXp: number;
  icon: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Beginner', minXp: 0, icon: '🌱' },
  { level: 2, name: 'Helper', minXp: 100, icon: '🤝' },
  { level: 3, name: 'Super Helper', minXp: 300, icon: '⭐' },
  { level: 4, name: 'Family Hero', minXp: 600, icon: '🦸' },
  { level: 5, name: 'Champion', minXp: 1000, icon: '🏆' },
];

export function getLevelForXp(xp: number): LevelInfo {
  let result = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.minXp) result = lvl;
  }
  return result;
}

export function getNextLevel(currentLevel: number): LevelInfo | null {
  return LEVELS.find((l) => l.level === currentLevel + 1) || null;
}

export function getLevelProgress(xp: number): { current: LevelInfo; next: LevelInfo | null; percent: number } {
  const current = getLevelForXp(xp);
  const next = getNextLevel(current.level);
  if (!next) return { current, next: null, percent: 100 };
  const range = next.minXp - current.minXp;
  const progress = xp - current.minXp;
  return { current, next, percent: Math.min(100, Math.round((progress / range) * 100)) };
}
