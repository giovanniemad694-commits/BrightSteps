import { useLanguage } from '@/contexts/LanguageContext';
import type { SortOption } from '@/types';

interface FilterBarProps {
  centuries: number[];
  selectedCentury: number | 'all';
  onCenturyChange: (century: number | 'all') => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function FilterBar({
  centuries,
  selectedCentury,
  onCenturyChange,
  sort,
  onSortChange,
}: FilterBarProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1">{t('patriarchs.filter_century')}</label>
        <select
          value={selectedCentury}
          onChange={(e) => onCenturyChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[var(--surface)] text-[var(--ink)] focus:border-[#c6a15b] focus:outline-none transition-colors"
        >
          <option value="all">{t('patriarchs.filter_all_centuries')}</option>
          {centuries.map((c) => (
            <option key={c} value={c}>
              {t('details.century')} {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1">{t('patriarchs.sort')}</label>
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
  );
}
