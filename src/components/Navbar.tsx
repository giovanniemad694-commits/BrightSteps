import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, Globe2, Sun, Moon, ArrowUpRight } from 'lucide-react';
import darkLogo from '@/assets/logos/dark.svg';
import lightLogo from '@/assets/logos/light.svg';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/patriarchs', label: t('nav.patriarchs') },
    { to: '/timeline', label: t('nav.timeline') },
    { to: '/sources', label: t('nav.sources') },
    { to: '/faith', label: t('nav.faith') },
    { to: '/about', label: t('nav.about') },
  ];

  const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className={`site-nav sticky top-0 z-50 text-white transition-all duration-300 ${scrolled ? 'bg-[#0d1012]/95 backdrop-blur-xl shadow-2xl' : 'bg-[#0d1012]/88 backdrop-blur-md'} border-b border-[#c6a15b]/25`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link to="/" className="flex flex-col items-center justify-center gap-0.5 group shrink-0" aria-label="Coptic Patriarchs Archive">
            <img
              src={theme === 'dark' ? darkLogo : lightLogo}
              alt={language === 'ar' ? 'أرشيف البطاركة' : 'Coptic Patriarchs Archive'}
              className="h-9 w-9 object-contain object-center transition-transform duration-300 group-hover:scale-110"
              draggable={false}
            />
            <span className="text-[10px] font-bold leading-none whitespace-nowrap transition-colors" style={{ color: 'var(--gold-bright)' }}>
              {language === 'ar' ? 'أرشيف البطاركة' : 'Patriarchs Archive'}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className={`relative py-3 text-sm font-semibold transition-colors hover:text-[#e0bd76] ${isActive(link.to) ? 'text-[#e0bd76]' : 'text-[#c8c1b4]'}`}>
                {link.label}
                {isActive(link.to) && <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-[#c6a15b]" />}
              </Link>
            ))}
            <div className="h-6 w-px bg-white/15" />
            <button onClick={toggleLanguage} className="flex items-center gap-1.5 text-sm text-[#c8c1b4] hover:text-[#e0bd76] transition-colors" aria-label="Switch language">
              <Globe2 className="w-4 h-4" />
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
            <button onClick={toggleTheme} className="w-9 h-9 rounded-full border border-[#c6a15b]/35 flex items-center justify-center text-[#e0bd76] hover:bg-[#c6a15b]/10 transition-colors" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <button className="md:hidden p-2 text-[#c8c1b4] hover:text-[#e0bd76]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" aria-expanded={menuOpen}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="site-nav-mobile md:hidden bg-[#111619] border-t border-white/10 px-4 pb-5 fade-in">
          <div className="flex flex-col gap-1 pt-3">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={`flex items-center justify-between py-3 px-3 rounded-lg text-sm font-semibold ${isActive(link.to) ? 'text-[#e0bd76] bg-[#c6a15b]/10' : 'text-[#c8c1b4]'}`}>
                {link.label}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            ))}
            <div className="flex items-center justify-between border-t border-white/10 mt-2 pt-3">
              <button onClick={toggleLanguage} className="flex items-center gap-2 py-2 text-sm text-[#c8c1b4]"><Globe2 className="w-4 h-4" />{language === 'ar' ? 'English' : 'العربية'}</button>
              <button onClick={toggleTheme} className="flex items-center gap-2 py-2 text-sm text-[#c8c1b4]">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}{theme === 'dark' ? 'Light' : 'Dark'}</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
