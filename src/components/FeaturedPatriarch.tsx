import { Link } from 'react-router-dom';
import { Crown, Calendar, ChevronLeft, Shield } from 'lucide-react';
import type { Patriarch } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import PatriarchImage from './PatriarchImage';
import { useReveal } from '@/hooks/useReveal';

interface FeaturedPatriarchProps {
  patriarch: Patriarch | null;
}

export default function FeaturedPatriarch({ patriarch }: FeaturedPatriarchProps) {
  const { t, language } = useLanguage();
  const { ref, visible } = useReveal<HTMLElement>();

  if (!patriarch) return null;

  const name = language === 'ar' ? patriarch.name_ar : patriarch.name_en;
  const papacyPeriod = [patriarch.papacy_start, patriarch.papacy_end || patriarch.death_date].filter(Boolean).join(' — ');

  return (
    <section ref={ref} className={`reveal ${visible ? 'is-visible' : ''} relative px-4 py-24 sm:px-6 lg:px-8 overflow-hidden`}>
      <div className="absolute inset-0 coptic-cross-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#48191d]/10 to-transparent" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
            {language === 'ar' ? 'إضاءة من التاريخ' : 'A highlight from history'}
          </p>
          <h2 className="section-title inline-block">{t('featured.title')}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">{t('featured.subtitle')}</p>
        </div>

        <div className="archive-surface rounded-3xl overflow-hidden">
          <div className="grid items-center gap-0 md:grid-cols-[minmax(300px,420px)_1fr]">
            <div className="relative h-72 md:h-full min-h-[320px] overflow-hidden bg-[#48191d]">
              <PatriarchImage src={patriarch.image_url} alt={name} className="h-full w-full transition-transform duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1012] via-transparent to-transparent opacity-60 md:opacity-40" />
              <div className="absolute top-5 ltr:right-5 rtl:left-5 flex items-center gap-1.5 rounded-full border border-[#e0bd76]/50 bg-[#0d1012]/70 px-3 py-1 text-xs font-bold text-[#e0bd76] backdrop-blur-sm">
                <Crown className="w-3.5 h-3.5" />#{patriarch.papal_number}
              </div>
            </div>

            <div className="p-8 sm:p-10 lg:p-12">
              <h3 className="text-3xl font-bold text-[var(--ink)] md:text-4xl">{name}</h3>
              <div className="gold-divider my-5 w-20" />

              <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-[var(--ink-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#c6a15b]" />
                  {papacyPeriod || '—'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-[#c6a15b]" />
                  {language === 'ar' ? `القرن ${patriarch.century}` : `Century ${patriarch.century}`}
                </span>
              </div>

              <p className="text-base leading-8 text-[var(--ink-soft)] mb-6 line-clamp-4">
                {patriarch.short_bio_ar}
              </p>

              {patriarch.faith_defense_ar && (
                <div className="rounded-2xl border border-[#c6a15b]/25 bg-gradient-to-br from-[#48191d]/15 to-transparent p-5 mb-6">
                  <div className="mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#e0bd76]" />
                    <h4 className="text-sm font-bold text-[#e0bd76]">{t('featured.faith_summary')}</h4>
                  </div>
                  <p className="text-sm leading-7 text-[var(--ink-soft)] line-clamp-3">
                    {patriarch.faith_defense_ar}
                  </p>
                </div>
              )}

              <Link to={`/patriarchs/${patriarch.id}`} className="btn-primary">
                {t('featured.discover')}
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
