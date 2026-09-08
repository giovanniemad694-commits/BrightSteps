import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Family, Child, Task, Reward, TaskCompletion, RewardRedemption, AppNotification, Achievement, ChildAchievement, PointsTransaction, MoneyTransaction, FamilySettings, TaskStatus } from '@/lib/types';
import * as demo from '@/lib/demo-data';

interface FamilyDataState {
  family: Family | null;
  children: Child[];
  tasks: Task[];
  rewards: Reward[];
  completions: TaskCompletion[];
  redemptions: RewardRedemption[];
  notifications: AppNotification[];
  achievements: Achievement[];
  childAchievements: ChildAchievement[];
  pointsTransactions: PointsTransaction[];
  moneyTransactions: MoneyTransaction[];
  settings: FamilySettings | null;
  loading: boolean;
  error: string | null;
  online: boolean;
  refresh: () => void;
  createTask: (task: Partial<Task>) => Promise<void>;
  createReward: (reward: Partial<Reward>) => Promise<void>;
  addChild: (child: Partial<Child>) => Promise<void>;
  updateChild: (childId: string, updates: Partial<Child>) => Promise<void>;
  removeChild: (childId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  approveTask: (completionId: string) => Promise<void>;
  rejectTask: (completionId: string) => Promise<void>;
  approveReward: (redemptionId: string) => Promise<void>;
  rejectReward: (redemptionId: string) => Promise<void>;
  redeemReward: (rewardId: string, childId: string) => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  updateSettings: (updates: Partial<FamilySettings>) => Promise<void>;
}

const FamilyDataContext = createContext<FamilyDataState | undefined>(undefined);

export function FamilyDataProvider({ children }: { children: ReactNode }) {
  const { user, isDemo } = useAuth();
  const [family, setFamily] = useState<Family | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [childAchievements, setChildAchievements] = useState<ChildAchievement[]>([]);
  const [pointsTransactions, setPointsTransactions] = useState<PointsTransaction[]>([]);
  const [moneyTransactions, setMoneyTransactions] = useState<MoneyTransaction[]>([]);
  const [settings, setSettings] = useState<FamilySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState(navigator.onLine);
  const familyIdRef = useRef<string | null>(null);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const loadAll = useCallback(async (famId: string) => {
    const { data: famChildren, error: cErr } = await supabase.from('children').select('*').eq('family_id', famId);
    if (cErr) throw cErr;

    const { data: famTasks } = await supabase.from('tasks').select('*').eq('family_id', famId).order('created_at', { ascending: false });
    const { data: famRewards } = await supabase.from('rewards').select('*').eq('family_id', famId).order('created_at', { ascending: false });
    const { data: famCompletions } = await supabase.from('task_completions').select('*, task:tasks(*), child:children(*)').eq('family_id', famId).order('created_at', { ascending: false });
    const { data: famRedemptions } = await supabase.from('reward_redemptions').select('*, reward:rewards(*), child:children(*)').eq('family_id', famId).order('created_at', { ascending: false });
    const { data: famNotifs } = await supabase.from('notifications').select('*').eq('family_id', famId).order('created_at', { ascending: false }).limit(20);
    const { data: allAchievements } = await supabase.from('achievements').select('*').or(`family_id.is.null,family_id.eq.${famId}`);
    const { data: famChildAch } = await supabase.from('child_achievements').select('*, achievement:achievements(*)').eq('family_id', famId);
    const { data: famPoints } = await supabase.from('points_transactions').select('*').eq('family_id', famId).order('created_at', { ascending: false }).limit(50);
    const { data: famMoney } = await supabase.from('money_transactions').select('*').eq('family_id', famId).order('created_at', { ascending: false }).limit(50);
    const { data: famSettings } = await supabase.from('family_settings').select('*').eq('family_id', famId).maybeSingle();

    setChildrenList(famChildren || []);
    setTasks(famTasks || []);
    setRewards(famRewards || []);
    setCompletions(famCompletions || []);
    setRedemptions(famRedemptions || []);
    setNotifications(famNotifs || []);
    setAchievements(allAchievements || []);
    setChildAchievements(famChildAch || []);
    setPointsTransactions(famPoints || []);
    setMoneyTransactions(famMoney || []);
    setSettings(famSettings || null);
  }, []);

  useEffect(() => {
    if (isDemo) {
      setFamily(demo.demoFamily);
      setChildrenList(demo.demoChildren);
      setTasks(demo.demoTasks);
      setRewards(demo.demoRewards);
      setCompletions(demo.demoCompletions);
      setRedemptions(demo.demoRedemptions);
      setNotifications(demo.demoNotifications);
      setAchievements(demo.demoAchievements);
      setChildAchievements(demo.demoChildAchievements);
      setPointsTransactions(demo.demoPointsTransactions);
      setMoneyTransactions(demo.demoMoneyTransactions);
      setSettings(demo.demoSettings);
      setLoading(false);
      setError(null);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: famData, error: famErr } = await supabase.from('families').select('*').eq('created_by', user.id).maybeSingle();
        if (famErr) throw famErr;

        if (!famData) {
          const { data: newFam, error: createErr } = await supabase.from('families').insert({ name: 'My Family' }).select().single();
          if (createErr) throw createErr;
          if (cancelled) return;
          setFamily(newFam);
          familyIdRef.current = newFam.id;
          await loadAll(newFam.id);
        } else {
          if (cancelled) return;
          setFamily(famData);
          familyIdRef.current = famData.id;
          await loadAll(famData.id);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user, isDemo, loadAll]);

  const refresh = useCallback(() => {
    if (isDemo) return;
    if (familyIdRef.current) loadAll(familyIdRef.current);
  }, [isDemo, loadAll]);

  const createTask = useCallback(async (task: Partial<Task>) => {
    if (isDemo) {
      const newTask: Task = {
        id: `demo-t-${Date.now()}`, family_id: 'demo-family', child_id: task.child_id || null,
        title: task.title || '', description: task.description || '', category: task.category || 'other',
        frequency: task.frequency || 'daily', due_date: task.due_date || null, due_time: task.due_time || null,
        reward_type: task.reward_type || 'points', reward_amount: task.reward_amount || 0,
        reward_unit: task.reward_unit || 'points', difficulty: task.difficulty || 'easy',
        icon: task.icon || '✅', color: task.color || 'blue', status: 'assigned',
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      return;
    }
    const famId = familyIdRef.current;
    if (!famId) return;
    const { error: err } = await supabase.from('tasks').insert({
      family_id: famId, child_id: task.child_id, title: task.title, description: task.description,
      category: task.category, frequency: task.frequency, due_date: task.due_date, due_time: task.due_time,
      reward_type: task.reward_type, reward_amount: task.reward_amount, reward_unit: task.reward_unit,
      difficulty: task.difficulty, icon: task.icon, color: task.color, status: 'assigned',
    });
    if (err) throw err;
    refresh();
  }, [isDemo, refresh]);

  const createReward = useCallback(async (reward: Partial<Reward>) => {
    if (isDemo) {
      const newReward: Reward = {
        id: `demo-r-${Date.now()}`, family_id: 'demo-family', name: reward.name || '',
        description: reward.description || '', icon: reward.icon || '🎁', reward_type: reward.reward_type || 'custom',
        cost: reward.cost || 0, cost_unit: reward.cost_unit || 'points', availability: 'available', stock: null,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      setRewards((prev) => [newReward, ...prev]);
      return;
    }
    const famId = familyIdRef.current;
    if (!famId) return;
    const { error: err } = await supabase.from('rewards').insert({
      family_id: famId, name: reward.name, description: reward.description, icon: reward.icon,
      reward_type: reward.reward_type, cost: reward.cost, cost_unit: reward.cost_unit, availability: 'available', stock: null,
    });
    if (err) throw err;
    refresh();
  }, [isDemo, refresh]);

  const addChild = useCallback(async (child: Partial<Child>) => {
    if (isDemo) {
      const newChild: Child = {
        id: `demo-c-${Date.now()}`, family_id: 'demo-family', name: child.name || '', nickname: child.nickname || null,
        avatar: child.avatar || '🦁', pin: null, age_group: child.age_group || 'primary',
        points: 0, money_balance: 0, screen_time_minutes: 0, xp: 0, level: 1, streak_days: 0,
        last_completion_date: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      setChildrenList((prev) => [...prev, newChild]);
      return;
    }
    const famId = familyIdRef.current;
    if (!famId) return;
    const { error: err } = await supabase.from('children').insert({
      family_id: famId, name: child.name, nickname: child.nickname, avatar: child.avatar, age_group: child.age_group,
    });
    if (err) throw err;
    refresh();
  }, [isDemo, refresh]);

  const updateChild = useCallback(async (childId: string, updates: Partial<Child>) => {
    if (isDemo) {
      setChildrenList((prev) => prev.map((c) => c.id === childId ? { ...c, ...updates } : c));
      return;
    }
    const { error: err } = await supabase.from('children').update({
      name: updates.name, nickname: updates.nickname, avatar: updates.avatar, age_group: updates.age_group,
    }).eq('id', childId);
    if (err) throw err;
    refresh();
  }, [isDemo, refresh]);

  const removeChild = useCallback(async (childId: string) => {
    if (isDemo) {
      setChildrenList((prev) => prev.filter((c) => c.id !== childId));
      return;
    }
    const { error: err } = await supabase.from('children').delete().eq('id', childId);
    if (err) throw err;
    refresh();
  }, [isDemo, refresh]);

  const completeTask = useCallback(async (taskId: string) => {
    if (isDemo) {
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: 'completed' as TaskStatus } : t));
      return;
    }
    const famId = familyIdRef.current;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.child_id || !famId) return;

    const { error: tcErr } = await supabase.from('task_completions').insert({
      task_id: taskId, child_id: task.child_id, family_id: famId, status: 'pending',
    });
    if (tcErr) throw tcErr;

    const { error: tErr } = await supabase.from('tasks').update({ status: 'completed' }).eq('id', taskId);
    if (tErr) throw tErr;

    const { error: nErr } = await supabase.from('notifications').insert({
      family_id: famId, child_id: task.child_id, type: 'task_completed',
      title: 'Task Completed', message: `${task.title} — approval needed`,
    });
    if (nErr) throw nErr;

    refresh();
  }, [isDemo, tasks, refresh]);

  const approveTask = useCallback(async (completionId: string) => {
    if (isDemo) {
      const completion = completions.find((c) => c.id === completionId);
      if (!completion) {
        const task = tasks.find((t) => t.id === completionId);
        if (task) {
          setTasks((prev) => prev.map((t) => t.id === completionId ? { ...t, status: 'approved' as TaskStatus } : t));
          setChildrenList((prev) => prev.map((c) => c.id === task.child_id ? {
            ...c, points: c.points + (task.reward_type === 'points' ? task.reward_amount : 0), xp: c.xp + task.reward_amount,
          } : c));
        }
        return;
      }
      return;
    }
    const { error: err } = await supabase.rpc('approve_task_completion', { p_completion_id: completionId });
    if (err) throw err;
    refresh();
  }, [isDemo, completions, tasks, refresh]);

  const rejectTask = useCallback(async (completionId: string) => {
    if (isDemo) {
      setTasks((prev) => prev.map((t) => t.id === completionId ? { ...t, status: 'assigned' as TaskStatus } : t));
      return;
    }
    const { error: err } = await supabase.rpc('reject_task_completion', { p_completion_id: completionId, p_reason: null });
    if (err) throw err;
    refresh();
  }, [isDemo, refresh]);

  const approveReward = useCallback(async (redemptionId: string) => {
    if (isDemo) {
      setChildrenList((prev) => prev.map((c) => {
        const redemption = redemptions.find((r) => r.id === redemptionId);
        if (!redemption || redemption.child_id !== c.id) return c;
        const reward = rewards.find((r) => r.id === redemption.reward_id);
        return { ...c, points: Math.max(0, c.points - (reward?.cost || 0)) };
      }));
      setRedemptions((prev) => prev.map((r) => r.id === redemptionId ? { ...r, status: 'approved' } : r));
      return;
    }
    const { error: err } = await supabase.rpc('approve_reward_redemption', { p_redemption_id: redemptionId });
    if (err) throw err;
    refresh();
  }, [isDemo, redemptions, rewards, refresh]);

  const rejectReward = useCallback(async (redemptionId: string) => {
    if (isDemo) {
      setRedemptions((prev) => prev.map((r) => r.id === redemptionId ? { ...r, status: 'rejected' } : r));
      return;
    }
    const { error: err } = await supabase.rpc('reject_reward_redemption', { p_redemption_id: redemptionId, p_reason: null });
    if (err) throw err;
    refresh();
  }, [isDemo, refresh]);

  const redeemReward = useCallback(async (rewardId: string, childId: string) => {
    if (isDemo) {
      const reward = rewards.find((r) => r.id === rewardId);
      if (!reward) return;
      const newRedemption: RewardRedemption = {
        id: `demo-rd-${Date.now()}`, reward_id: rewardId, child_id: childId, family_id: 'demo-family',
        status: 'pending', redeemed_at: new Date().toISOString(), reviewed_at: null, reviewed_by: null,
        rejection_reason: null, created_at: new Date().toISOString(),
      };
      setRedemptions((prev) => [newRedemption, ...prev]);
      return;
    }
    const famId = familyIdRef.current;
    if (!famId) return;
    const { error: err } = await supabase.from('reward_redemptions').insert({
      reward_id: rewardId, child_id: childId, family_id: famId, status: 'pending',
    });
    if (err) throw err;

    const { error: nErr } = await supabase.from('notifications').insert({
      family_id: famId, child_id: childId, type: 'reward_requested',
      title: 'Reward Request', message: 'A reward redemption request needs your approval',
    });
    if (nErr) throw nErr;

    refresh();
  }, [isDemo, rewards, refresh]);

  const markNotificationsRead = useCallback(async () => {
    if (isDemo) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      return;
    }
    const famId = familyIdRef.current;
    if (!famId) return;
    await supabase.from('notifications').update({ is_read: true }).eq('family_id', famId).eq('is_read', false);
    refresh();
  }, [isDemo, refresh]);

  const updateSettings = useCallback(async (updates: Partial<FamilySettings>) => {
    const safeUpdates: Record<string, unknown> = {};
    if ('enable_points' in updates) safeUpdates.enable_points = updates.enable_points;
    if ('enable_money' in updates) safeUpdates.enable_money = updates.enable_money;
    if ('enable_screen_time' in updates) safeUpdates.enable_screen_time = updates.enable_screen_time;
    if ('enable_custom_rewards' in updates) safeUpdates.enable_custom_rewards = updates.enable_custom_rewards;
    if ('currency' in updates) safeUpdates.currency = updates.currency;
    if ('language' in updates) safeUpdates.language = updates.language;
    if ('notify_task_completion' in updates) safeUpdates.notify_task_completion = updates.notify_task_completion;
    if ('notify_reward_request' in updates) safeUpdates.notify_reward_request = updates.notify_reward_request;
    if ('parent_pin' in updates) safeUpdates.parent_pin = updates.parent_pin;

    if (isDemo) {
      setSettings((prev) => prev ? { ...prev, ...updates } : prev);
      return;
    }
    const famId = familyIdRef.current;
    if (!famId) return;

    if (settings) {
      const { error: err } = await supabase.from('family_settings').update(safeUpdates).eq('family_id', famId);
      if (err) throw err;
    } else {
      const { error: err } = await supabase.from('family_settings').insert({ family_id: famId, ...safeUpdates });
      if (err) throw err;
    }
    setSettings((prev) => prev ? { ...prev, ...updates } : { ...updates } as FamilySettings);
  }, [isDemo, settings, refresh]);

  return (
    <FamilyDataContext.Provider
      value={{
        family, children: childrenList, tasks, rewards, completions, redemptions,
        notifications, achievements, childAchievements, pointsTransactions, moneyTransactions,
        settings, loading, error, online, refresh,
        createTask, createReward, addChild, updateChild, removeChild,
        completeTask, approveTask, rejectTask, approveReward, rejectReward,
        redeemReward, markNotificationsRead, updateSettings,
      }}
    >
      {children}
    </FamilyDataContext.Provider>
  );
}

export function useFamilyData() {
  const ctx = useContext(FamilyDataContext);
  if (!ctx) throw new Error('useFamilyData must be used within FamilyDataProvider');
  return ctx;
}
