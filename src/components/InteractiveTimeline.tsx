import { Link } from 'react-router-dom';
import { Crown, Calendar, ChevronLeft } from 'lucide-react';
import type { Patriarch } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import PatriarchImage from './PatriarchImage';
import { useReveal } from '@/hooks/useReveal';

interface InteractiveTimelineProps {
  patriarchs: Patriarch[];
}

function TimelineEntry({ patriarch, index }: { patriarch: Patriarch; index: number }) {
  const { language } = useLanguage();
  const { ref, visible } = useReveal<HTMLAnchorElement>();
  const name = language === 'ar' ? patriarch.name_ar : patriarch.name_en;
  const papacyPeriod = [patriarch.papacy_start, patriarch.papacy_end || patriarch.death_date].filter(Boolean).join(' — ');

  return (
    <Link
      ref={ref}
      to={`/patriarchs/${patriarch.id}`}
      style={{ transitionDelay: `${Math.min(index, 8) * 80}ms` }}
      className={`group relative flex items-start gap-5 reveal ${visible ? 'is-visible' : ''}`}
    >
      <div className="relative z-10 mt-5 h-4 w-4 shrink-0 rounded-full border-4 border-[var(--bg)] bg-[#c6a15b] shadow-[0_0_0_4px_rgba(198,161,91,.15)] group-hover:scale-125 transition-transform duration-300" />
      <div className="flex flex-1 items-center gap-4 rounded-2xl border border-white/10 bg-[var(--surface)] p-4 card-hover md:p-5">
        <div className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:block">
          <PatriarchImage src={patriarch.image_url} alt={name} className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#e0bd76]">
              <Crown className="w-3 h-3" />#{patriarch.papal_number}
            </span>
            <span className="text-xs text-[var(--ink-muted)]">
              {language === 'ar' ? `القرن ${patriarch.century}` : `Century ${patriarch.century}`}
            </span>
          </div>
          <h3 className="font-bold text-[var(--ink)] group-hover:text-[#e0bd76] transition-colors truncate">{name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--ink-muted)]">
            <Calendar className="w-3 h-3 text-[#c6a15b]" />
            {papacyPeriod || '—'}
          </p>
          <p className="mt-2 text-sm text-[var(--ink-soft)] line-clamp-2 hidden md:block">{patriarch.short_bio_ar}</p>
        </div>
        <ChevronLeft className="w-5 h-5 shrink-0 text-[#c6a15b] rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export default function InteractiveTimeline({ patriarchs }: InteractiveTimelineProps) {
  const { t, language } = useLanguage();
  const sorted = [...patriarchs].sort((a, b) => a.papal_number - b.papal_number);

  return (
    <div>
      <p className="mb-6 text-center text-sm text-[var(--ink-muted)]">{t('timeline.click_to_read')}</p>
      <div className="relative">
        <div className="absolute ltr:left-[7px] rtl:right-[7px] top-5 bottom-5 w-px bg-gradient-to-b from-transparent via-[#c6a15b] to-transparent" />
        <div className="space-y-5">
          {sorted.map((patriarch, index) => (
            <TimelineEntry key={patriarch.id} patriarch={patriarch} index={index} />
          ))}
        </div>
      </div>
      {sorted.length === 0 && (
        <p className="py-12 text-center text-[var(--ink-muted)]">
          {language === 'ar' ? 'لا توجد بيانات.' : 'No data available.'}
        </p>
      )}
    </div>
  );
}
