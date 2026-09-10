import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronLeft, BookOpen, Users } from 'lucide-react';
import type { Patriarch } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { FAITH_CATEGORIES, patriarchsByCategory, type FaithCategory } from '@/lib/faithCategories';
import PatriarchImage from './PatriarchImage';
import { useReveal } from '@/hooks/useReveal';

interface FaithPreservedProps {
  patriarchs: Patriarch[];
  isPage?: boolean;
}

export default function FaithPreserved({ patriarchs, isPage = false }: FaithPreservedProps) {
  const { t, language } = useLanguage();
  const [selected, setSelected] = useState<FaithCategory>('faith_defense');
  const { ref, visible } = useReveal<HTMLElement>();

  const filtered = useMemo(() => patriarchsByCategory(patriarchs, selected), [patriarchs, selected]);

  const wrapperClass = isPage
    ? 'min-h-screen archive-grid px-4 py-16 sm:px-6 lg:px-8'
    : `reveal ${visible ? 'is-visible' : ''} px-4 py-24 sm:px-6 lg:px-8`;

  return (
    <section ref={ref} className={wrapperClass}>
      <div className={isPage ? 'mx-auto max-w-7xl' : 'mx-auto max-w-7xl'}>
        <div className="mb-12 text-center">
          {!isPage && (
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
              {language === 'ar' ? 'دور البطاركة' : 'Their role'}
            </p>
          )}
          <div className="mb-4 flex items-center justify-center">
            <Shield className="w-9 h-9 text-[#c6a15b]" />
          </div>
          <h2 className="section-title inline-block">{t('faith.title')}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">{t('faith.subtitle')}</p>
        </div>

        <p className="mb-6 text-center text-sm text-[var(--ink-muted)]">{t('faith.select_category')}</p>

        <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-3">
          {FAITH_CATEGORIES.map((cat) => {
            const count = patriarchsByCategory(patriarchs, cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selected === cat
                    ? 'bg-gradient-to-br from-[#762525] to-[#48191d] text-[#e0bd76] shadow-lg border border-[#c6a15b]/40'
                    : 'border border-white/10 text-[var(--ink-soft)] hover:border-[#c6a15b]/50 hover:text-[var(--ink)]'
                }`}
              >
                {t(`category.${cat}`)}
                <span className="ml-1.5 text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => {
              const name = language === 'ar' ? p.name_ar : p.name_en;
              return (
                <Link
                  key={p.id}
                  to={`/patriarchs/${p.id}`}
                  style={{ transitionDelay: `${Math.min(i, 6) * 70}ms` }}
                  className={`group archive-surface rounded-2xl overflow-hidden card-hover reveal ${visible ? 'is-visible' : ''}`}
                >
                  <div className="relative h-52 overflow-hidden bg-[#48191d]">
                    <PatriarchImage src={p.image_url} alt={name} className="w-full h-full transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1012] via-transparent to-transparent opacity-70" />
                    <div className="absolute bottom-3 ltr:left-4 rtl:right-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#e0bd76]">#{p.papal_number}</p>
                      <h3 className="text-lg font-bold text-[#f5efe1] mt-0.5">{name}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-7 text-[var(--ink-soft)] line-clamp-3 mb-4">
                      {p.contributions_ar || p.faith_defense_ar || p.short_bio_ar}
                    </p>
                    <div className="flex items-center justify-between text-sm font-bold text-[#c6a15b] group-hover:text-[#e0bd76] transition-colors">
                      <span>{t('faith.read_more')}</span>
                      <ChevronLeft className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="w-16 h-16 text-[#c6a15b] mb-4" />
            <h3 className="text-xl font-bold text-[var(--ink)] mb-2">{t('faith.no_patriarchs')}</h3>
            <p className="text-sm text-[var(--ink-muted)] max-w-md">{t('faith.no_patriarchs_text')}</p>
          </div>
        )}

        {!isPage && (
          <div className="mt-10 text-center">
            <Link to="/faith" className="btn-secondary">
              {language === 'ar' ? 'استكشف المزيد' : 'Explore more'}
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
