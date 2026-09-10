import { useState, useMemo } from 'react';
import { ChevronDown, X, Crown, Calendar, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FAITH_CATEGORIES, type FaithCategory } from '@/lib/faithCategories';
import type { SortOption, Patriarch } from '@/types';

interface AdvancedSearchProps {
  patriarchs: Patriarch[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedCentury: number | 'all';
  onCenturyChange: (value: number | 'all') => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  papalNumberFilter: string;
  onPapalNumberChange: (value: string) => void;
  papacyPeriodFilter: string;
  onPapacyPeriodChange: (value: string) => void;
  faithCategory: FaithCategory | 'all';
  onFaithCategoryChange: (value: FaithCategory | 'all') => void;
  onClearAll: () => void;
  resultCount: number;
}

export default function AdvancedSearch({
  patriarchs,
  search,
  onSearchChange,
  selectedCentury,
  onCenturyChange,
  sort,
  onSortChange,
  papalNumberFilter,
  onPapalNumberChange,
  papacyPeriodFilter,
  onPapacyPeriodChange,
  faithCategory,
  onFaithCategoryChange,
  onClearAll,
  resultCount,
}: AdvancedSearchProps) {
  const { t, language } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const centuries = useMemo(
    () => Array.from(new Set(patriarchs.map((p) => p.century))).sort((a, b) => a - b),
    [patriarchs],
  );

  const hasActiveFilters = papalNumberFilter || papacyPeriodFilter || faithCategory !== 'all' || selectedCentury !== 'all';

  return (
    <div className="archive-surface rounded-2xl p-4 sm:p-6">
      <div className="relative w-full group mb-2">
        <svg className="absolute top-1/2 -translate-y-1/2 ltr:left-5 rtl:right-5 w-5 h-5 text-[#c6a15b] transition-transform group-focus-within:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('patriarchs.search_placeholder')}
          aria-label={t('patriarchs.search_placeholder')}
          className="w-full pl-14 pr-12 rtl:pr-14 rtl:pl-12 py-4 rounded-xl border border-white/10 bg-[var(--surface)]/85 text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[#c6a15b] focus:ring-2 focus:ring-[#c6a15b]/15 focus:outline-none transition-all"
        />
        {search && (
          <button onClick={() => onSearchChange('')} className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 p-1 text-[var(--ink-muted)] hover:text-[#e0bd76]" aria-label="Clear">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs text-[var(--ink-muted)] mb-3 ltr:pl-1 rtl:pr-1">{t('search.searching_in')}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#c6a15b] hover:text-[#e0bd76] transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? t('search.advanced_hide') : t('search.advanced_toggle')}
        </button>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-muted)] hover:text-[#e85d5d] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            {t('search.clear_filters')}
          </button>
        )}
      </div>

      {expanded && (
        <div className="fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-white/10 pt-4">
          <div>
            <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5 inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c6a15b]" />
              {t('patriarchs.filter_century')}
            </label>
            <select
              value={selectedCentury}
              onChange={(e) => onCenturyChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[var(--surface)] text-[var(--ink)] focus:border-[#c6a15b] focus:outline-none transition-colors"
            >
              <option value="all">{t('patriarchs.filter_all_centuries')}</option>
              {centuries.map((c) => (
                <option key={c} value={c}>{t('journey.century')} {c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5 inline-flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#c6a15b]" />
              {t('search.papal_number')}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={papalNumberFilter}
              onChange={(e) => onPapalNumberChange(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: 24' : 'e.g. 24'}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[#c6a15b] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5 inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c6a15b]" />
              {t('search.papacy_period')}
            </label>
            <input
              type="text"
              value={papacyPeriodFilter}
              onChange={(e) => onPapacyPeriodChange(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: 632' : 'e.g. 632'}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[#c6a15b] focus:outline-none transition-colors"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5 inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#c6a15b]" />
              {t('search.faith_category')}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFaithCategoryChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${faithCategory === 'all' ? 'bg-[#c6a15b] text-[#0d1012]' : 'border border-white/10 text-[var(--ink-soft)] hover:border-[#c6a15b]'}`}
              >
                {t('search.all_categories')}
              </button>
              {FAITH_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onFaithCategoryChange(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${faithCategory === cat ? 'bg-[#c6a15b] text-[#0d1012]' : 'border border-white/10 text-[var(--ink-soft)] hover:border-[#c6a15b]'}`}
                >
                  {t(`category.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">{t('patriarchs.sort')}</label>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[var(--surface)] text-[var(--ink)] focus:border-[#c6a15b] focus:outline-none transition-colors"
            >
              <option value="papal_number_asc">{t('patriarchs.sort.number_asc')}</option>
              <option value="papal_number_desc">{t('patriarchs.sort.number_desc')}</option>
              <option value="century_asc">{t('patriarchs.sort.century_asc')}</option>
              <option value="name_asc">{t('patriarchs.sort.name_asc')}</option>
            </select>
          </div>
        </div>
      )}

      {resultCount > 0 && (
        <p className="mt-3 text-xs text-[var(--ink-muted)] ltr:pl-1 rtl:pr-1">
          <span className="font-bold text-[#c6a15b]">{resultCount}</span> {t('search.results_found')}
        </p>
      )}
    </div>
  );
}
