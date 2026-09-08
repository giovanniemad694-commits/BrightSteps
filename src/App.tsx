import { useEffect, useState, useCallback } from 'react';
import type { FormEvent } from 'react';
import {
  Bell, Check, CheckCircle2, ClipboardCheck, Gift, Home, Languages, LogOut,
  Moon, RotateCcw, Settings, Sparkles, Sun, Trophy, UserRound, Users, X,
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { FamilyDataProvider, useFamilyData } from '@/contexts/FamilyDataContext';
import { getTranslation, getGreeting } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { AuthScreen } from '@/components/AuthScreen';
import { TaskModal, RewardModal, ChildModal } from '@/components/Modals';
import { LoadingSpinner, ErrorState } from '@/components/ui';
import { ParentHome, ParentTasks, ParentRewards, FamilyView, SettingsView } from '@/components/ParentViews';
import { ChildHome, ChildTasks, ChildRewards, AchievementsView, ProfileView } from '@/components/ChildViews';

type Mode = 'parent' | 'child';
type ParentTab = 'home' | 'tasks' | 'rewards' | 'family' | 'settings';
type ChildTab = 'home' | 'tasks' | 'rewards' | 'achievements' | 'profile';

function AppContent() {
  const { session, user, loading: authContextLoading, isDemo, signIn, signUp, signOut, enterDemo } = useAuth();
  const familyData = useFamilyData();

  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem('brightsteps-locale') as Locale) || 'en');
  const [mode, setMode] = useState<Mode>('parent');
  const [parentTab, setParentTab] = useState<ParentTab>('home');
  const [childTab, setChildTab] = useState<ChildTab>('home');
  const [authMode, setAuthMode] = useState<'welcome' | 'signin' | 'signup'>('welcome');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [toast, setToast] = useState('');
  const [toastError, setToastError] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('brightsteps-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  const t = getTranslation(locale);
  const isAuthenticated = !!session || isDemo;

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    localStorage.setItem('brightsteps-locale', locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('brightsteps-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (familyData.children.length > 0 && !selectedChildId) {
      setSelectedChildId(familyData.children[0].id);
    }
  }, [familyData.children, selectedChildId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((msg: string, isError = false) => {
    setToast(msg);
    setToastError(isError);
  }, []);

  const handleAuth = async (event: FormEvent<HTMLFormElement>, action: 'signin' | 'signup') => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    const name = String(form.get('name') || 'Parent');
    const result = action === 'signin' ? await signIn(email, password) : await signUp(email, password, name);
    if (result.error) setAuthError(result.error);
    setAuthLoading(false);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await familyData.completeTask(taskId);
      showToast(t.taskCompleted);
    } catch {
      showToast(t.errorLoading, true);
    }
  };

  const handleApproveTask = async (completionId: string) => {
    try {
      await familyData.approveTask(completionId);
      showToast(t.taskApproved);
    } catch {
      showToast(t.errorLoading, true);
    }
  };

  const handleRejectTask = async (completionId: string) => {
    try {
      await familyData.rejectTask(completionId);
      showToast(t.taskRejected);
    } catch {
      showToast(t.errorLoading, true);
    }
  };

  const handleApproveReward = async (redemptionId: string) => {
    try {
      await familyData.approveReward(redemptionId);
      showToast(t.rewardApproved);
    } catch {
      showToast(t.errorLoading, true);
    }
  };

  const handleRejectReward = async (redemptionId: string) => {
    try {
      await familyData.rejectReward(redemptionId);
      showToast(t.rewardRejected);
    } catch {
      showToast(t.errorLoading, true);
    }
  };

  const handleRedeem = async (rewardId: string) => {
    try {
      await familyData.redeemReward(rewardId, selectedChildId);
      showToast(t.rewardRedeemed);
    } catch {
      showToast(t.errorLoading, true);
    }
  };

  const handleCreateTask = async (task: Parameters<typeof familyData.createTask>[0]) => {
    try {
      await familyData.createTask(task);
      setShowTaskModal(false);
      showToast(t.taskCreated);
    } catch {
      showToast(t.errorLoading, true);
    }
  };

  const handleCreateReward = async (reward: Parameters<typeof familyData.createReward>[0]) => {
    try {
      await familyData.createReward(reward);
      setShowRewardModal(false);
      showToast(t.rewardCreated);
    } catch {
      showToast(t.errorLoading, true);
    }
  };

  const handleAddChild = async (child: Parameters<typeof familyData.addChild>[0]) => {
    try {
      await familyData.addChild(child);
      setShowChildModal(false);
      showToast(t.childAdded);
    } catch {
      showToast(t.errorLoading, true);
    }
  };

  const handleRemoveChild = async (childId: string) => {
    if (!confirm(t.confirmRemoveChild)) return;
    try {
      await familyData.removeChild(childId);
      showToast(t.childRemoved);
    } catch {
      showToast(t.errorLoading, true);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setMode('parent');
    setParentTab('home');
  };

  if (authContextLoading) return <LoadingSpinner text={t.loading} />;

  if (!isAuthenticated) {
    return (
      <AuthScreen
        locale={locale}
        setLocale={setLocale}
        authMode={authMode}
        setAuthMode={setAuthMode}
        onSubmit={handleAuth}
        error={authError}
        loading={authLoading}
        onDemo={enterDemo}
        t={t}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  if (familyData.loading) return <LoadingSpinner text={t.loading} />;

  if (familyData.error && !isDemo) {
    return <ErrorState text={t.errorLoading} onRetry={familyData.refresh} />;
  }

  const selectedChild = familyData.children.find((c) => c.id === selectedChildId) || familyData.children[0];
  const parentName = user?.user_metadata?.display_name || 'Parent';
  const activeTab = mode === 'parent' ? parentTab : childTab;
  const unreadNotifs = familyData.notifications.filter((n) => !n.is_read).length;

  const navItems = mode === 'parent' ? [
    { id: 'home' as const, label: t.home, icon: Home },
    { id: 'tasks' as const, label: t.tasks, icon: ClipboardCheck },
    { id: 'rewards' as const, label: t.rewards, icon: Gift },
    { id: 'family' as const, label: t.family, icon: Users },
    { id: 'settings' as const, label: t.settings, icon: Settings },
  ] : [
    { id: 'home' as const, label: t.home, icon: Home },
    { id: 'tasks' as const, label: t.myTasks, icon: ClipboardCheck },
    { id: 'rewards' as const, label: t.rewards, icon: Gift },
    { id: 'achievements' as const, label: t.achievements, icon: Trophy },
    { id: 'profile' as const, label: t.profile, icon: UserRound },
  ];

  return (
    <div className="app-shell">
      <div className="app-frame">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark"><Sparkles size={18} /></div>
            <span>Bright<span>Steps</span></span>
          </div>
          <div className="top-actions">
            <button className="icon-button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button className="icon-button" onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} aria-label={t.language}>
              <Languages size={19} />
            </button>
            <button className="icon-button notification-button" onClick={() => setShowNotifications(!showNotifications)} aria-label={t.notifications}>
              <Bell size={19} />
              {unreadNotifs > 0 && <span className="notification-dot" />}
            </button>
            <div className="mini-avatar">{mode === 'child' && selectedChild ? selectedChild.avatar : parentName[0]}</div>
          </div>

          {showNotifications && (
            <div className="notification-popover">
              <div className="popover-head">
                <strong>{t.notifications}</strong>
                {unreadNotifs > 0 && <span className="tiny-pill">{unreadNotifs} {t.newNotification}</span>}
              </div>
              {familyData.notifications.length > 0 ? (
                familyData.notifications.slice(0, 6).map((n) => (
                  <div className="notification-item" key={n.id}>
                    <div className={cn('notification-icon', n.type.includes('approved') ? 'green' : 'orange')}>
                      {n.type.includes('approved') ? <Check size={15} /> : <Gift size={15} />}
                    </div>
                    <div>
                      <strong>{n.title}</strong>
                      <small>{n.message}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="notification-item"><small>{t.noNotifications}</small></div>
              )}
            </div>
          )}
        </header>

        <main className="main-content">
          {mode === 'parent' && parentTab === 'home' && (
            <ParentHome
              t={t} locale={locale} parentName={parentName}
              children={familyData.children} tasks={familyData.tasks}
              completions={familyData.completions} redemptions={familyData.redemptions}
              onApproveTask={handleApproveTask} onRejectTask={handleRejectTask}
              onApproveReward={handleApproveReward} onRejectReward={handleRejectReward}
              onSelectChild={(id) => { setSelectedChildId(id); setParentTab('family'); }}
              onAddTask={() => setShowTaskModal(true)}
            />
          )}
          {mode === 'parent' && parentTab === 'tasks' && (
            <ParentTasks
              t={t} tasks={familyData.tasks} children={familyData.children}
              completions={familyData.completions}
              onAddTask={() => setShowTaskModal(true)}
              onApproveTask={handleApproveTask} onRejectTask={handleRejectTask}
            />
          )}
          {mode === 'parent' && parentTab === 'rewards' && (
            <ParentRewards t={t} rewards={familyData.rewards} onAddReward={() => setShowRewardModal(true)} />
          )}
          {mode === 'parent' && parentTab === 'family' && (
            <FamilyView
              t={t} locale={locale} children={familyData.children}
              selectedChildId={selectedChildId} setSelectedChildId={setSelectedChildId}
              tasks={familyData.tasks} pointsTransactions={familyData.pointsTransactions}
              onAddChild={() => setShowChildModal(true)} onRemoveChild={handleRemoveChild}
            />
          )}
          {mode === 'parent' && parentTab === 'settings' && (
            <SettingsView
              t={t} locale={locale} parentName={parentName}
              familyName={familyData.family?.name || 'My Family'}
              settings={familyData.settings}
              darkMode={darkMode} setDarkMode={setDarkMode}
              onLocaleChange={setLocale}
              onLogout={handleLogout}
              onUpdateSettings={familyData.updateSettings}
            />
          )}
          {mode === 'child' && childTab === 'home' && selectedChild && (
            <ChildHome
              t={t} locale={locale} child={selectedChild} tasks={familyData.tasks}
              onComplete={handleCompleteTask}
              onNavigate={(tab) => setChildTab(tab)}
            />
          )}
          {mode === 'child' && childTab === 'tasks' && selectedChild && (
            <ChildTasks t={t} child={selectedChild} tasks={familyData.tasks} onComplete={handleCompleteTask} />
          )}
          {mode === 'child' && childTab === 'rewards' && selectedChild && (
            <ChildRewards t={t} child={selectedChild} rewards={familyData.rewards} onRedeem={handleRedeem} />
          )}
          {mode === 'child' && childTab === 'achievements' && selectedChild && (
            <AchievementsView
              t={t} child={selectedChild}
              achievements={familyData.achievements}
              childAchievements={familyData.childAchievements}
            />
          )}
          {mode === 'child' && childTab === 'profile' && selectedChild && (
            <ProfileView
              t={t} child={selectedChild}
              setChild={setSelectedChildId} children={familyData.children}
              pointsTransactions={familyData.pointsTransactions} locale={locale}
            />
          )}
        </main>

        <button className="mode-switch" onClick={() => {
          setMode(mode === 'parent' ? 'child' : 'parent');
          setParentTab('home');
          setChildTab('home');
        }}>
          <RotateCcw size={14} /> {mode === 'parent' ? t.switchToChild : t.switchToParent}
        </button>

        <nav className="bottom-nav">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={cn('nav-item', activeTab === id && 'active')}
              onClick={() => (mode === 'parent' ? setParentTab(id as ParentTab) : setChildTab(id as ChildTab))}
              aria-label={label}
            >
              <Icon size={21} strokeWidth={activeTab === id ? 2.5 : 1.8} />
              <span>{label}</span>
              {activeTab === id && <i />}
            </button>
          ))}
        </nav>
      </div>

      {toast && (
        <div className={cn('toast', toastError && 'toast-error')}>
          {toastError ? <X size={18} /> : <CheckCircle2 size={18} />}
          {toast}
        </div>
      )}

      {showTaskModal && (
        <TaskModal t={t} children={familyData.children} onClose={() => setShowTaskModal(false)} onSave={handleCreateTask} />
      )}
      {showRewardModal && (
        <RewardModal t={t} onClose={() => setShowRewardModal(false)} onSave={handleCreateReward} />
      )}
      {showChildModal && (
        <ChildModal t={t} onClose={() => setShowChildModal(false)} onSave={handleAddChild} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <FamilyDataProvider>
        <AppContent />
      </FamilyDataProvider>
    </AuthProvider>
  );
}

export default App;
