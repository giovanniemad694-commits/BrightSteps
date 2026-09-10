import { Link } from 'react-router-dom';
import { Church, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import darkLogo from '@/assets/logos/dark.svg';
import lightLogo from '@/assets/logos/light.svg';

export default function Footer() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  return (
    <footer className="site-footer mt-24 border-t border-[#c6a15b]/25 bg-[#0b0e10] text-[#c8c1b4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div><div className="flex flex-col items-start gap-1 mb-4"><img src={theme === 'dark' ? darkLogo : lightLogo} alt={language === 'ar' ? 'أرشيف البطاركة' : 'Coptic Patriarchs Archive'} className="h-12 w-12 object-contain object-center" draggable={false} /><span className="font-bold text-[#f5efe1]">{language === 'ar' ? 'أرشيف البطاركة' : 'Patriarchs Archive'}</span></div><p className="text-sm leading-7 text-[#8e918c] max-w-sm">{t('footer.tagline')}</p></div>
          <div><h4 className="mb-4 text-xs uppercase tracking-[0.22em] text-[#c6a15b]">{t('footer.pages')}</h4><ul className="space-y-3 text-sm">{['/', '/patriarchs', '/timeline', '/sources', '/faith', '/about'].map((path) => <li key={path}><Link to={path} className="inline-flex items-center gap-1 hover:text-[#e0bd76] transition-colors">{path === '/' ? t('nav.home') : path === '/patriarchs' ? t('nav.patriarchs') : path === '/timeline' ? t('nav.timeline') : path === '/sources' ? t('nav.sources') : path === '/faith' ? t('nav.faith') : t('nav.about')}<ArrowUpRight className="w-3 h-3" /></Link></li>)}</ul></div>
          <div><div className="flex items-center gap-2 mb-4 text-[#f5efe1]"><Church className="w-5 h-5 text-[#c6a15b]" /><span className="font-semibold">{language === 'ar' ? 'مشروع تعليمي' : 'Educational Project'}</span></div><p className="text-sm leading-7 text-[#8e918c]">{t('footer.about_project')}</p></div>
        </div>
        <div className="gold-divider mt-12 mb-6" /><p className="text-center text-xs text-[#77736b]">{language === 'ar' ? 'بطاركة حافظوا على الإيمان — مشروع مسابقة حاسوب © 2025' : 'Patriarchs Who Preserved the Faith — Computer Competition Project © 2025'}</p>
      </div>
    </footer>
  );
}
