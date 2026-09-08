import { useState } from 'react';
import {
  ArrowRight, Bell, Check, ChevronRight, ClipboardCheck, CircleDollarSign, Clock3,
  Gift, HeartHandshake, LogOut, Languages, LockKeyhole, Menu, Moon, Plus, Settings,
  SlidersHorizontal, BarChart3, Star, Sun, Target, Trash2, Users, Wallet, X, Zap,
  ShieldCheck, CheckCircle2,
} from 'lucide-react';
import type { Translation } from '@/lib/i18n';
import type { Child, Task, Reward, TaskCompletion, RewardRedemption, FamilySettings } from '@/lib/types';
import { getGreeting, formatCurrency, getRewardDisplay, cn, formatDate } from '@/lib/utils';
import { getLevelProgress } from '@/lib/constants';
import { SectionHeader, StatCard, EmptyState } from './ui';

interface ParentHomeProps {
  t: Translation;
  locale: 'en' | 'ar';
  parentName: string;
  children: Child[];
  tasks: Task[];
  completions: TaskCompletion[];
  redemptions: RewardRedemption[];
  onApproveTask: (completionId: string) => void;
  onRejectTask: (completionId: string) => void;
  onApproveReward: (redemptionId: string) => void;
  onRejectReward: (redemptionId: string) => void;
  onSelectChild: (id: string) => void;
  onAddTask: () => void;
}

export function ParentHome(props: ParentHomeProps) {
  const { t, locale, parentName, children, tasks, completions, redemptions, onApproveTask, onRejectTask, onApproveReward, onRejectReward, onSelectChild, onAddTask } = props;
  const pendingCompletions = completions.filter((c) => c.status === 'pending');
  const pendingRedemptions = redemptions.filter((r) => r.status === 'pending');
  const doneToday = tasks.filter((task) => task.status === 'approved').length;
  const totalPoints = children.reduce((sum, c) => sum + c.points, 0);
  const greeting = getGreeting(locale);

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{greeting}</p>
          <h1>{parentName} <span className="wave">✦</span></h1>
          <p className="muted">{t.heresWhatsHappening}</p>
        </div>
        <button className="round-add" onClick={onAddTask} aria-label={t.addTask}><Plus size={21} /></button>
      </div>

      <div className="overview-grid">
        <StatCard icon={<Users size={15} />} label={t.children} value={children.length} tone="blue" />
        <StatCard icon={<ClipboardCheck size={15} />} label={t.tasksDone} value={doneToday} tone="green" />
        <StatCard icon={<Clock3 size={15} />} label={t.pendingApprovals} value={pendingCompletions.length + pendingRedemptions.length} tone="orange" />
        <StatCard icon={<Star size={15} />} label={t.pointsEarned} value={totalPoints} tone="yellow" />
      </div>

      {pendingCompletions.length > 0 && (
        <section className="section">
          <SectionHeader title={t.pendingApprovals} icon={<Bell size={18} />} />
          <div className="approval-list">
            {pendingCompletions.slice(0, 4).map((comp) => {
              const child = children.find((c) => c.id === comp.child_id);
              const task = comp.task || tasks.find((t) => t.id === comp.task_id);
              return (
                <div className="approval-item" key={comp.id}>
                  <div className="task-icon small">{task?.icon || '✅'}</div>
                  <div className="approval-info">
                    <strong>{child?.name} — {task?.title}</strong>
                    <small>{getRewardDisplay(task?.reward_type || 'points', task?.reward_amount || 0, task?.reward_unit || 'points')}</small>
                  </div>
                  <button className="reject-button" onClick={() => onRejectTask(comp.id)} aria-label={t.reject}><X size={15} /></button>
                  <button className="approve-button" onClick={() => onApproveTask(comp.id)} aria-label={t.approve}><Check size={17} /></button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {pendingRedemptions.length > 0 && (
        <section className="section">
          <SectionHeader title={t.rewardStore} icon={<Gift size={18} />} />
          <div className="approval-list">
            {pendingRedemptions.slice(0, 3).map((red) => {
              const child = children.find((c) => c.id === red.child_id);
              const reward = red.reward;
              return (
                <div className="approval-item" key={red.id}>
                  <div className="task-icon small">{reward?.icon || '🎁'}</div>
                  <div className="approval-info">
                    <strong>{child?.name} — {reward?.name}</strong>
                    <small>{reward?.cost} {t.points}</small>
                  </div>
                  <button className="reject-button" onClick={() => onRejectReward(red.id)} aria-label={t.reject}><X size={15} /></button>
                  <button className="approve-button" onClick={() => onApproveReward(red.id)} aria-label={t.approve}><Check size={17} /></button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="section">
        <SectionHeader title={t.yourChildren} icon={<HeartHandshake size={18} />} action={t.seeFamily} onAction={() => onSelectChild(children[0]?.id)} />
        <div className="children-row">
          {children.map((child) => {
            const childTasks = tasks.filter((task) => task.child_id === child.id);
            const approved = childTasks.filter((task) => task.status === 'approved').length;
            const total = childTasks.length;
            const progress = total > 0 ? Math.round((approved / total) * 100) : 0;
            return (
              <button className="child-summary" key={child.id} onClick={() => onSelectChild(child.id)}>
                <div className="child-summary-top">
                  <div className="large-avatar">{child.avatar}<span className="online-dot" /></div>
                  <div>
                    <strong>{child.name}</strong>
                    <small>{t.level} {child.level} · {child.streak_days} {t.streak}</small>
                  </div>
                  <ChevronRight size={17} />
                </div>
                <div className="mini-progress"><div style={{ width: `${Math.max(progress, 10)}%` }} /></div>
                <div className="child-summary-bottom">
                  <span>{progress}% {t.completed}</span>
                  <b><Star size={13} fill="currentColor" /> {child.points}</b>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

interface ParentTasksProps {
  t: Translation;
  tasks: Task[];
  children: Child[];
  completions: TaskCompletion[];
  onAddTask: () => void;
  onApproveTask: (completionId: string) => void;
  onRejectTask: (completionId: string) => void;
}

export function ParentTasks(props: ParentTasksProps) {
  const { t, tasks, children, completions, onAddTask, onApproveTask, onRejectTask } = props;
  const [filter, setFilter] = useState('all');
  const visible = filter === 'all' ? tasks : tasks.filter((task) => task.status === filter || (filter === 'completed' && task.status === 'completed'));

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t.manage}</p>
          <h1>{t.tasks}</h1>
          <p className="muted">{t.keepFamilyMoving}</p>
        </div>
        <button className="round-add" onClick={onAddTask} aria-label={t.addTask}><Plus size={21} /></button>
      </div>

      <div className="filter-pills">
        {[
          { id: 'all', label: t.all },
          { id: 'assigned', label: t.assigned },
          { id: 'completed', label: t.needsReview },
          { id: 'approved', label: t.approved },
        ].map(({ id, label }) => (
          <button key={id} className={cn(filter === id && 'selected')} onClick={() => setFilter(id)}>{label}</button>
        ))}
      </div>

      <div className="task-list parent-list">
        {visible.map((task) => {
          const child = children.find((c) => c.id === task.child_id);
          const completion = completions.find((c) => c.task_id === task.id && c.status === 'pending');
          return (
            <div className="task-row" key={task.id}>
              <div className={cn('task-icon', `color-${task.color}`)}>{task.icon}</div>
              <div className="task-row-info">
                <div>
                  <strong>{task.title}</strong>
                  <small>{child?.name || t.allChildren} · {task.frequency}</small>
                </div>
                <b className="reward-label">{getRewardDisplay(task.reward_type, task.reward_amount, task.reward_unit)}</b>
                <div className="task-status">
                  <span className={cn('status-dot', task.status)} />
                  {task.status === 'completed' ? t.waitingApproval : task.status === 'approved' ? t.approved : task.status === 'rejected' ? t.rejected : t.assigned}
                </div>
              </div>
              {task.status === 'completed' && completion && (
                <>
                  <button className="reject-button" onClick={() => onRejectTask(completion.id)} aria-label={t.reject}><X size={15} /></button>
                  <button className="approve-button" onClick={() => onApproveTask(completion.id)} aria-label={t.approve}><Check size={17} /></button>
                </>
              )}
            </div>
          );
        })}
      </div>
      {visible.length === 0 && <EmptyState icon={<ClipboardCheck size={32} />} text={t.allCaught} />}
    </div>
  );
}

interface ParentRewardsProps {
  t: Translation;
  rewards: Reward[];
  onAddReward: () => void;
}

export function ParentRewards({ t, rewards, onAddReward }: ParentRewardsProps) {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t.celebrateProgress}</p>
          <h1>{t.rewards}</h1>
          <p className="muted">{t.makeHabitsSpecial}</p>
        </div>
        <button className="round-add" onClick={onAddReward} aria-label={t.addReward}><Plus size={21} /></button>
      </div>

      <div className="reward-hero">
        <div>
          <span>{t.rewardStore}</span>
          <strong>{rewards.length} <small>{t.activeRewards}</small></strong>
          <p>{t.littleMoments}</p>
        </div>
        <div className="hero-gift">🎁</div>
      </div>

      <div className="reward-grid">
        {rewards.map((reward) => (
          <div className="reward-card" key={reward.id}>
            <div className="reward-art">{reward.icon}</div>
            <div className="reward-card-content">
              <strong>{reward.name}</strong>
              <p>{reward.description}</p>
              <div className="reward-card-bottom">
                <span><Star size={14} fill="currentColor" /> {reward.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {rewards.length === 0 && <EmptyState icon={<Gift size={32} />} text={t.noRewards} />}
    </div>
  );
}

interface FamilyViewProps {
  t: Translation;
  locale: 'en' | 'ar';
  children: Child[];
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
  tasks: Task[];
  pointsTransactions: { amount: number; reason: string; created_at: string }[];
  onAddChild: () => void;
  onRemoveChild: (id: string) => void;
}

export function FamilyView(props: FamilyViewProps) {
  const { t, locale, children, selectedChildId, setSelectedChildId, tasks, pointsTransactions, onAddChild, onRemoveChild } = props;
  const child = children.find((c) => c.id === selectedChildId) || children[0];
  if (!child) return <EmptyState icon={<Users size={32} />} text={t.noTasks} />;
  const level = getLevelProgress(child.xp);
  const childTasks = tasks.filter((task) => task.child_id === child.id);
  const childHistory = pointsTransactions.filter((pt) => pt.reason?.includes(child.name) || tasks.some((task) => task.child_id === child.id && pt.reason?.includes(task.title))).slice(0, 5);

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t.yourFamily}</p>
          <h1>{t.family}</h1>
          <p className="muted">{t.everyoneGrows}</p>
        </div>
        <button className="round-add" onClick={onAddChild} aria-label={t.addChild}><Plus size={21} /></button>
      </div>

      <div className="family-tabs">
        {children.map((item) => (
          <button key={item.id} className={cn(selectedChildId === item.id && 'selected')} onClick={() => setSelectedChildId(item.id)}>
            <span>{item.avatar}</span>{item.name}
          </button>
        ))}
      </div>

      <div className="profile-banner">
        <div className="profile-avatar">{child.avatar}</div>
        <div>
          <h2>{child.name}</h2>
          <p>{t.level} {child.level} · {level.current.name}</p>
          <div className="level-progress"><div style={{ width: `${level.percent}%` }} /></div>
          <small>{child.xp} / {level.next?.minXp || 'MAX'} XP</small>
        </div>
        <button className="edit-profile" onClick={() => onRemoveChild(child.id)} aria-label={t.removeChild}><Trash2 size={16} /></button>
      </div>

      <div className="balance-grid">
        <div><Star size={18} fill="currentColor" /><strong>{child.points}</strong><span>{t.points}</span></div>
        <div><CircleDollarSign size={18} /><strong>{formatCurrency(child.money_balance)}</strong><span>{t.money}</span></div>
        <div><Zap size={18} fill="currentColor" /><strong>{child.streak_days}</strong><span>{t.streak}</span></div>
      </div>

      <section className="section">
        <SectionHeader title={t.recentTasks} icon={<Target size={18} />} />
        <div className="simple-list">
          {childTasks.slice(0, 4).map((task) => (
            <div className="simple-row" key={task.id}>
              <span className="task-icon tiny">{task.icon}</span>
              <div><strong>{task.title}</strong><small>{task.status === 'approved' ? t.approved : t.assigned}</small></div>
              <b>{getRewardDisplay(task.reward_type, task.reward_amount, task.reward_unit)}</b>
            </div>
          ))}
          {childTasks.length === 0 && <div className="empty-state-mini">{t.noTasks}</div>}
        </div>
      </section>

      {childHistory.length > 0 && (
        <section className="section">
          <SectionHeader title={t.history} icon={<BarChart3 size={18} />} />
          <div className="simple-list">
            {childHistory.map((pt, i) => (
              <div className="simple-row" key={i}>
                <div><strong>{pt.reason}</strong><small>{formatDate(pt.created_at, locale)}</small></div>
                <b className={pt.amount >= 0 ? 'reward-label' : 'spent-label'}>{pt.amount >= 0 ? '+' : ''}{pt.amount} ⭐</b>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

interface SettingsViewProps {
  t: Translation;
  locale: 'en' | 'ar';
  parentName: string;
  familyName: string;
  settings: FamilySettings | null;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  onLocaleChange: (v: 'en' | 'ar') => void;
  onLogout: () => void;
  onUpdateSettings: (updates: Partial<FamilySettings>) => void;
}

export function SettingsView({ t, locale, parentName, familyName, settings, darkMode, setDarkMode, onLocaleChange, onLogout, onUpdateSettings }: SettingsViewProps) {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t.makeItYours}</p>
          <h1>{t.settings}</h1>
          <p className="muted">{t.simpleControls}</p>
        </div>
        <div className="settings-avatar">{parentName[0]}</div>
      </div>

      <div className="settings-profile">
        <div className="settings-profile-avatar">{parentName[0]}</div>
        <div><strong>{parentName}</strong><small>{t.parentAccount}</small></div>
        <ChevronRight size={18} />
      </div>

      <div className="settings-list">
        <div className="setting-row">
          <span className="setting-icon blue"><Users size={19} /></span>
          <div><strong>{t.familySettings}</strong><small>{familyName}</small></div>
          <ChevronRight size={17} />
        </div>
        <div className="setting-row">
          <span className="setting-icon blue"><SlidersHorizontal size={19} /></span>
          <div><strong>{t.rewardTypes}</strong><small>{t.pointsMoneyScreenTime}</small></div>
          <ChevronRight size={17} />
        </div>
        <div className="setting-row">
          <span className="setting-icon blue"><Bell size={19} /></span>
          <div><strong>{t.notifications}</strong><small>{t.taskCompletionsAndRequests}</small></div>
          <button className={cn('toggle', (settings?.notify_task_completion ?? true) && 'on')} onClick={() => onUpdateSettings({ notify_task_completion: !(settings?.notify_task_completion ?? true) })}><i /></button>
        </div>
        <div className="setting-row">
          <span className="setting-icon blue"><LockKeyhole size={19} /></span>
          <div><strong>{t.pinSecurity}</strong><small>{t.protectParentControls}</small></div>
          <ChevronRight size={17} />
        </div>
        <div className="setting-row" onClick={() => onLocaleChange(locale === 'en' ? 'ar' : 'en')}>
          <span className="setting-icon blue"><Languages size={19} /></span>
          <div><strong>{t.language}</strong><small>{locale === 'en' ? 'English' : 'العربية'}</small></div>
          <ChevronRight size={17} />
        </div>
        <div className="setting-row">
          <span className="setting-icon yellow">{darkMode ? <Moon size={19} /> : <Sun size={19} />}</span>
          <div><strong>{t.appearance}</strong><small>{darkMode ? t.darkMode : t.lightMode}</small></div>
          <button className={cn('toggle', darkMode && 'on')} onClick={() => setDarkMode(!darkMode)}><i /></button>
        </div>
        <div className="setting-row">
          <span className="setting-icon blue"><ShieldCheck size={19} /></span>
          <div><strong>{t.dataPrivacy}</strong><small>{t.yourDataStaysPrivate}</small></div>
          <ChevronRight size={17} />
        </div>
      </div>

      <button className="logout-button" onClick={onLogout}>
        <LogOut size={17} /> {t.signOut}
      </button>
      <p className="version-label">BrightSteps · Family-first rewards</p>
    </div>
  );
}
