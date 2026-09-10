import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ChevronLeft, Compass } from 'lucide-react';
import type { Patriarch } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReveal } from '@/hooks/useReveal';
import PatriarchCard from './PatriarchCard';

interface JourneyThroughHistoryProps {
  patriarchs: Patriarch[];
}

interface CenturyGroup {
  century: number;
  patriarchs: Patriarch[];
}

export default function JourneyThroughHistory({ patriarchs }: JourneyThroughHistoryProps) {
  const { t, language } = useLanguage();
  const [selectedCentury, setSelectedCentury] = useState<number | null>(null);
  const { ref, visible } = useReveal<HTMLElement>();

  const centuryGroups: CenturyGroup[] = useMemo(() => {
    const map = new Map<number, Patriarch[]>();
    for (const p of patriarchs) {
      if (!map.has(p.century)) map.set(p.century, []);
      map.get(p.century)!.push(p);
    }
    return Array.from(map.entries())
      .map(([century, ps]) => ({ century, patriarchs: ps }))
      .sort((a, b) => a.century - b.century);
  }, [patriarchs]);

  const selectedGroup = selectedCentury ? centuryGroups.find((g) => g.century === selectedCentury) : null;

  const centuryLabel = (c: number) => {
    if (language === 'ar') {
      const ones = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر'];
      const tens = ['', 'الحادي', 'الثاني', 'الثالث'];
      if (c <= 10) return `القرن ${ones[c]}`;
      return `القرن ${c}`;
    }
    const suffix = c % 100 >= 11 && c % 100 <= 13 ? 'th' : c % 10 === 1 ? 'st' : c % 10 === 2 ? 'nd' : c % 10 === 3 ? 'rd' : 'th';
    return `${c}${suffix} Century`;
  };

  return (
    <section ref={ref} className={`reveal ${visible ? 'is-visible' : ''} px-4 py-24 sm:px-6 lg:px-8`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
            {language === 'ar' ? 'استكشف القرون' : 'Explore the centuries'}
          </p>
          <h2 className="section-title inline-block">{t('journey.title')}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">{t('journey.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-10">
          {centuryGroups.map((group, i) => (
            <button
              key={group.century}
              onClick={() => setSelectedCentury(selectedCentury === group.century ? null : group.century)}
              style={{ transitionDelay: `${Math.min(i, 8) * 60}ms` }}
              className={`reveal ${visible ? 'is-visible' : ''} archive-surface rounded-2xl p-5 text-center transition-all duration-300 ${
                selectedCentury === group.century
                  ? 'ring-2 ring-[#c6a15b] border-[#c6a15b]'
                  : 'hover:border-[#c6a15b]/50'
              }`}
            >
              <div className="mb-3 flex items-center justify-center">
                <Compass className={`w-7 h-7 transition-colors ${selectedCentury === group.century ? 'text-[#e0bd76]' : 'text-[#c6a15b]'}`} />
              </div>
              <p className="text-sm font-bold text-[var(--ink)] mb-1">{centuryLabel(group.century)}</p>
              <p className="text-xs text-[var(--ink-muted)]">
                {group.patriarchs.length} {t('journey.patriarchs_count')}
              </p>
            </button>
          ))}
        </div>

        {selectedGroup && (
          <div className="fade-in archive-surface rounded-3xl p-5 sm:p-8">
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#c6a15b]" />
                <div>
                  <h3 className="text-2xl font-bold text-[var(--ink)]">{centuryLabel(selectedGroup.century)}</h3>
                  <p className="text-sm text-[var(--ink-muted)] mt-0.5">
                    {selectedGroup.patriarchs.length} {t('journey.patriarchs_count')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCentury(null)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c6a15b] hover:text-[#e0bd76] transition-colors"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>

            <div className="mb-6 flex items-center gap-2 text-sm text-[var(--ink-soft)]">
              <Users className="w-4 h-4 text-[#c6a15b]" />
              <span>{t('journey.featured')}</span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {selectedGroup.patriarchs.map((p, i) => (
                <PatriarchCard key={p.id} patriarch={p} index={i} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/patriarchs" className="btn-secondary">
                {t('journey.view_all')}
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
