import {
  Check, CheckCircle2, Circle, Gift, LockKeyhole, Plus, ShieldCheck, Sparkles, Star,
  Target, Trophy, UserRound, Wallet, Zap, X, Clock,
} from 'lucide-react';
import type { Translation } from '@/lib/i18n';
import type { Child, Task, Reward, Achievement, ChildAchievement, PointsTransaction } from '@/lib/types';
import { getGreeting, formatCurrency, cn, formatDate } from '@/lib/utils';
import { getLevelProgress } from '@/lib/constants';
import { SectionHeader, EmptyState } from './ui';

interface ChildHomeProps {
  t: Translation;
  locale: 'en' | 'ar';
  child: Child;
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onNavigate: (tab: 'tasks' | 'rewards' | 'achievements' | 'profile') => void;
}

export function ChildHome({ t, locale, child, tasks, onComplete, onNavigate }: ChildHomeProps) {
  const ownTasks = tasks.filter((task) => task.child_id === child.id);
  const openTasks = ownTasks.filter((task) => task.status === 'assigned');
  const level = getLevelProgress(child.xp);
  const greeting = getGreeting(locale);

  return (
    <div className="page child-page">
      <div className="child-greeting">
        <div>
          <p className="eyebrow">{greeting}</p>
          <h1>{t.hi}, {child.name}! <span>✦</span></h1>
          <p className="muted">{t.readyForGreatDay}</p>
        </div>
        <div className="child-avatar-header">
          {child.avatar}
          <span>{child.streak_days} <Zap size={12} fill="currentColor" /></span>
        </div>
      </div>

      <div className="child-stats">
        <div><Star size={20} fill="currentColor" /><strong>{child.points}</strong><small>{t.points}</small></div>
        <div><Wallet size={20} /><strong>{formatCurrency(child.money_balance)}</strong><small>{t.money}</small></div>
        <div><Clock size={20} /><strong>{child.screen_time_minutes}</strong><small>{t.screenTime}</small></div>
      </div>

      <div className="level-card">
        <div className="level-icon">{level.current.icon}</div>
        <div className="level-info">
          <div>
            <strong>{t.level} {level.current.level} · {level.current.name}</strong>
            <span>{child.xp} XP</span>
          </div>
          <div className="level-bar"><div style={{ width: `${level.percent}%` }} /></div>
          <small>{level.next ? `${level.next.minXp - child.xp} ${t.toLevel} ${level.next.name}` : t.topLevel}</small>
        </div>
      </div>

      <section className="section child-tasks-section">
        <SectionHeader title={t.todaysTasks} icon={<Target size={18} />} action={t.seeAll} onAction={() => onNavigate('tasks')} />
        <div className="child-task-list">
          {openTasks.slice(0, 4).map((task) => (
            <button className="child-task-card" key={task.id} onClick={() => onComplete(task.id)}>
              <div className={cn('task-icon', `color-${task.color}`)}>{task.icon}</div>
              <div>
                <strong>{task.title}</strong>
                <small>{task.description}</small>
              </div>
              <div className="child-task-reward">
                <span>+{task.reward_amount}</span>
                <Star size={14} fill="currentColor" />
              </div>
              <div className="tap-check"><Circle size={24} /></div>
            </button>
          ))}
          {openTasks.length === 0 && <EmptyState icon={<Sparkles size={32} />} text={t.allCaught} />}
        </div>
      </section>

      <div className="celebrate-banner">
        <div>
          <Sparkles size={20} />
          <strong>{t.keepGoing}</strong>
          <p>{t.everyStepMatters}</p>
        </div>
        <div className="banner-stars">✦ ✦ ✦</div>
      </div>
    </div>
  );
}

interface ChildTasksProps {
  t: Translation;
  child: Child;
  tasks: Task[];
  onComplete: (taskId: string) => void;
}

export function ChildTasks({ t, child, tasks, onComplete }: ChildTasksProps) {
  const ownTasks = tasks.filter((task) => task.child_id === child.id);
  const todoCount = ownTasks.filter((task) => task.status === 'assigned').length;
  const doneCount = ownTasks.filter((task) => task.status === 'approved').length;
  const waitingCount = ownTasks.filter((task) => task.status === 'completed').length;

  return (
    <div className="page child-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t.keepItUp}</p>
          <h1>{t.myTasks}</h1>
          <p className="muted">{t.doingGreat}, {child.name}.</p>
        </div>
        <div className="tiny-streak"><Zap size={16} fill="currentColor" /> {child.streak_days}</div>
      </div>

      <div className="task-filter-summary">
        <span><strong>{todoCount}</strong> {t.toDo}</span>
        <span><strong>{doneCount}</strong> {t.done}</span>
        <span><strong>{waitingCount}</strong> {t.waiting}</span>
      </div>

      <div className="child-task-list full-list">
        {ownTasks.map((task) => (
          <div className={cn('child-task-card', task.status !== 'assigned' && 'inactive')} key={task.id}>
            <div className={cn('task-icon', `color-${task.color}`)}>{task.icon}</div>
            <div>
              <strong>{task.title}</strong>
              <small>{task.status === 'approved' ? `✓ ${t.done}` : task.status === 'completed' ? t.waitingApproval : task.description}</small>
            </div>
            <div className="child-task-reward">
              <span>+{task.reward_amount}</span>
              <Star size={14} fill="currentColor" />
            </div>
            {task.status === 'assigned' ? (
              <button className="tap-check" onClick={() => onComplete(task.id)} aria-label={t.tapToComplete}><Circle size={24} /></button>
            ) : (
              <CheckCircle2 className="completed-icon" size={23} />
            )}
          </div>
        ))}
        {ownTasks.length === 0 && <EmptyState icon={<Target size={32} />} text={t.noTasks} />}
      </div>
    </div>
  );
}

interface ChildRewardsProps {
  t: Translation;
  child: Child;
  rewards: Reward[];
  onRedeem: (rewardId: string) => void;
}

export function ChildRewards({ t, child, rewards, onRedeem }: ChildRewardsProps) {
  return (
    <div className="page child-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t.dreamBig}</p>
          <h1>{t.rewards}</h1>
          <p className="muted">{t.pointsToSpend}: <b className="text-yellow">{child.points}</b></p>
        </div>
        <div className="points-badge"><Star size={16} fill="currentColor" /> {child.points}</div>
      </div>

      <div className="reward-grid child-reward-grid">
        {rewards.map((reward) => (
          <div className="reward-card child-reward-card" key={reward.id}>
            <div className="reward-art">{reward.icon}</div>
            <div className="reward-card-content">
              <strong>{reward.name}</strong>
              <p>{reward.description}</p>
              <div className="reward-card-bottom">
                <span><Star size={14} fill="currentColor" /> {reward.cost}</span>
                <button disabled={child.points < reward.cost} onClick={() => onRedeem(reward.id)}>
                  {child.points < reward.cost ? t.notEnoughPoints : t.redeem}
                </button>
              </div>
            </div>
          </div>
        ))}
        {rewards.length === 0 && <EmptyState icon={<Gift size={32} />} text={t.noRewards} />}
      </div>
    </div>
  );
}

interface AchievementsViewProps {
  t: Translation;
  child: Child;
  achievements: Achievement[];
  childAchievements: ChildAchievement[];
}

export function AchievementsView({ t, child, achievements, childAchievements }: AchievementsViewProps) {
  const earnedIds = new Set(childAchievements.map((ca) => ca.achievement_id));
  const earned = achievements.filter((a) => earnedIds.has(a.id));
  const locked = achievements.filter((a) => !earnedIds.has(a.id));

  return (
    <div className="page child-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t.celebrateWins}</p>
          <h1>{t.achievements}</h1>
          <p className="muted">{t.unlockedBadges}: {earned.length}/{achievements.length}</p>
        </div>
        <div className="trophy-count"><Trophy size={18} /> {earned.length}/{achievements.length}</div>
      </div>

      <div className="achievement-hero">
        <div className="achievement-orb">🏆</div>
        <div>
          <strong>{t.youreAStar}, {child.name}!</strong>
          <p>{t.keepTakingSteps}</p>
        </div>
      </div>

      <div className="achievement-grid">
        {achievements.map((achievement) => {
          const isEarned = earnedIds.has(achievement.id);
          return (
            <div className={cn('achievement-card', !isEarned && 'locked')} key={achievement.id}>
              <div className="achievement-icon">
                {isEarned ? achievement.icon : <LockKeyhole size={21} />}
              </div>
              <strong>{achievement.name}</strong>
              <small>{achievement.description}</small>
              {isEarned && <span><Check size={12} /> {t.unlocked}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ProfileViewProps {
  t: Translation;
  child: Child;
  setChild: (id: string) => void;
  children: Child[];
  pointsTransactions: PointsTransaction[];
  locale: 'en' | 'ar';
}

export function ProfileView({ t, child, setChild, children, pointsTransactions, locale }: ProfileViewProps) {
  const level = getLevelProgress(child.xp);
  const childHistory = pointsTransactions.filter((pt) => pt.child_id === child.id).slice(0, 8);

  return (
    <div className="page child-page">
      <div className="profile-center">
        <div className="profile-big-avatar">{child.avatar}</div>
        <h1>{child.name}</h1>
        <p>{t.level} {child.level} · {level.current.name}</p>
        <div className="profile-stats">
          <div><strong>{child.points}</strong><small>{t.points}</small></div>
          <div><strong>{child.xp}</strong><small>XP</small></div>
          <div><strong>{child.streak_days}</strong><small>{t.streak}</small></div>
        </div>
      </div>

      {childHistory.length > 0 && (
        <section className="section">
          <SectionHeader title={t.history} icon={<Target size={18} />} />
          <div className="simple-list">
            {childHistory.map((pt) => (
              <div className="simple-row" key={pt.id}>
                <div><strong>{pt.reason}</strong><small>{formatDate(pt.created_at, locale)}</small></div>
                <b className={pt.amount >= 0 ? 'reward-label' : 'spent-label'}>
                  {pt.amount >= 0 ? '+' : ''}{pt.amount} ⭐
                </b>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <SectionHeader title={t.chooseProfile} icon={<UserRound size={18} />} />
        <div className="profile-switcher">
          {children.map((item) => (
            <button key={item.id} className={cn(item.id === child.id && 'selected')} onClick={() => setChild(item.id)}>
              <span>{item.avatar}</span>
              <strong>{item.name}</strong>
              {item.id === child.id && <Check size={16} />}
            </button>
          ))}
        </div>
      </section>

      <div className="privacy-note">
        <ShieldCheck size={19} />
        <div>
          <strong>{t.familySafeSpace}</strong>
          <p>{t.profileOnlyVisible}</p>
        </div>
      </div>
    </div>
  );
}
