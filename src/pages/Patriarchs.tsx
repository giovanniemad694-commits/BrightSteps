import { useState, useMemo } from 'react';
import { Archive } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatriarchs } from '@/hooks/usePatriarchs';
import PatriarchCard from '@/components/PatriarchCard';
import AdvancedSearch from '@/components/AdvancedSearch';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { patriarchsByCategory, type FaithCategory } from '@/lib/faithCategories';
import type { SortOption } from '@/types';

export default function Patriarchs() {
  const { t } = useLanguage();
  const { patriarchs, loading, error } = usePatriarchs();
  const [search, setSearch] = useState('');
  const [selectedCentury, setSelectedCentury] = useState<number | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('papal_number_asc');
  const [papalNumberFilter, setPapalNumberFilter] = useState('');
  const [papacyPeriodFilter, setPapacyPeriodFilter] = useState('');
  const [faithCategory, setFaithCategory] = useState<FaithCategory | 'all'>('all');

  const filtered = useMemo(() => {
    let result = [...patriarchs];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) =>
        [
          p.name_ar,
          p.name_en,
          p.short_bio_ar,
          p.biography_ar,
          p.faith_defense_ar || '',
          p.historical_background_ar || '',
          p.contributions_ar || '',
          p.challenges_ar || '',
        ].some((field) => field.toLowerCase().includes(q)),
      );
    }

    if (selectedCentury !== 'all') result = result.filter((p) => p.century === selectedCentury);

    if (papalNumberFilter.trim()) {
      const num = parseInt(papalNumberFilter.trim(), 10);
      if (!isNaN(num)) result = result.filter((p) => p.papal_number === num);
    }

    if (papacyPeriodFilter.trim()) {
      const period = papacyPeriodFilter.trim().toLowerCase();
      result = result.filter((p) =>
        [p.papacy_start || '', p.papacy_end || '', p.death_date || '']
          .some((field) => field.toLowerCase().includes(period)),
      );
    }

    if (faithCategory !== 'all') {
      result = result.filter((p) => patriarchsByCategory([p], faithCategory).length > 0);
    }

    result.sort((a, b) =>
      sort === 'papal_number_desc' ? b.papal_number - a.papal_number
      : sort === 'century_asc' ? a.century - b.century || a.papal_number - b.papal_number
      : sort === 'name_ar_asc' ? a.name_ar.localeCompare(b.name_ar, 'ar')
      : a.papal_number - b.papal_number,
    );

    return result;
  }, [patriarchs, search, selectedCentury, sort, papalNumberFilter, papacyPeriodFilter, faithCategory]);

  const clearAll = () => {
    setSearch('');
    setSelectedCentury('all');
    setPapalNumberFilter('');
    setPapacyPeriodFilter('');
    setFaithCategory('all');
    setSort('papal_number_asc');
  };

  return (
    <div className="min-h-screen archive-grid px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3 text-[#c6a15b]">
              <Archive className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.25em]">The living archive</span>
            </div>
            <h1 className="text-5xl font-bold text-[var(--ink)] md:text-6xl">{t('patriarchs.title')}</h1>
            <div className="mt-5 h-1 w-20 bg-[#c6a15b]" />
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--ink-muted)]">{t('home.intro.text')}</p>
        </div>

        <div className="mb-8">
          <AdvancedSearch
            patriarchs={patriarchs}
            search={search}
            onSearchChange={setSearch}
            selectedCentury={selectedCentury}
            onCenturyChange={setSelectedCentury}
            sort={sort}
            onSortChange={setSort}
            papalNumberFilter={papalNumberFilter}
            onPapalNumberChange={setPapalNumberFilter}
            papacyPeriodFilter={papacyPeriodFilter}
            onPapacyPeriodChange={setPapacyPeriodFilter}
            faithCategory={faithCategory}
            onFaithCategoryChange={setFaithCategory}
            onClearAll={clearAll}
            resultCount={filtered.length}
          />
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : filtered.length === 0 ? (
          <EmptyState title={t('search.no_results')} message={t('search.no_results_text')} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <PatriarchCard key={p.id} patriarch={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
