import type { FormEvent } from 'react';
import { ArrowRight, Sparkles, Sun, Moon, Languages, ShieldCheck, Star, CheckCircle2 } from 'lucide-react';
import type { Translation, Locale } from '@/lib/i18n';

interface AuthScreenProps {
  locale: Locale;
  setLocale: (v: Locale) => void;
  authMode: 'welcome' | 'signin' | 'signup';
  setAuthMode: (v: 'welcome' | 'signin' | 'signup') => void;
  onSubmit: (e: FormEvent<HTMLFormElement>, action: 'signin' | 'signup') => void;
  error: string;
  loading: boolean;
  onDemo: () => void;
  t: Translation;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export function AuthScreen({ locale, setLocale, authMode, setAuthMode, onSubmit, error, loading, onDemo, t, darkMode, setDarkMode }: AuthScreenProps) {
  return (
    <div className="auth-page">
      <div className="auth-shape one" />
      <div className="auth-shape two" />
      <button className="locale-switch" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <button className="locale-switch lang-btn" onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} aria-label="Switch language">
        <Languages size={16} /> {locale === 'en' ? 'العربية' : 'English'}
      </button>
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark large"><Sparkles size={26} /></div>
          <div>
            <strong>Bright<span>Steps</span></strong>
            <small>{t.tagline}</small>
          </div>
        </div>
        {authMode === 'welcome' ? (
          <>
            <div className="welcome-illustration">
              <div className="sun-orb"><Sun size={30} /></div>
              <div className="hero-star star-a"><Star size={18} fill="currentColor" /></div>
              <div className="hero-star star-b"><Star size={13} fill="currentColor" /></div>
              <div className="hero-card"><CheckCircle2 size={22} /><span>{t.completed} 3 {t.tasks}</span></div>
              <div className="hero-avatar">🦁</div>
            </div>
            <h1>{t.welcome}</h1>
            <p className="auth-tagline">{t.tagline}</p>
            <button className="primary-button full" onClick={() => setAuthMode('signup')}>
              {t.continue} <ArrowRight size={18} />
            </button>
            <button className="secondary-button full" onClick={onDemo}>
              <Sparkles size={17} /> {t.demo}
            </button>
            <p className="auth-switch">{t.alreadyHaveAccount} <button onClick={() => setAuthMode('signin')}>{t.signIn}</button></p>
          </>
        ) : (
          <>
            <button className="back-button" onClick={() => setAuthMode('welcome')}>
              <ArrowRight size={16} /> {t.welcome}
            </button>
            <h1>{authMode === 'signin' ? t.signIn : t.signUp}</h1>
            <p className="auth-tagline">{t.tagline}</p>
            <form onSubmit={(e) => onSubmit(e, authMode)} className="auth-form">
              {authMode === 'signup' && (
                <label>{t.fullName}<input name="name" placeholder="Ahmed" required /></label>
              )}
              <label>{t.email}<input name="email" type="email" placeholder="you@example.com" required /></label>
              <label>{t.password}<input name="password" type="password" placeholder="••••••••" minLength={6} required /></label>
              {error && <div className="form-error">{error}</div>}
              <button className="primary-button full" disabled={loading}>
                {loading ? '...' : authMode === 'signin' ? t.signIn : t.signUp} <ArrowRight size={18} />
              </button>
            </form>
            <button className="secondary-button full" onClick={onDemo}>
              <Sparkles size={17} /> {t.demo}
            </button>
          </>
        )}
      </div>
      <div className="auth-foot"><ShieldCheck size={14} /> {t.safePrivate}</div>
    </div>
  );
}
