import { History } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatriarchs } from '@/hooks/usePatriarchs';
import InteractiveTimeline from '@/components/InteractiveTimeline';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';

export default function Timeline() {
  const { t } = useLanguage();
  const { patriarchs, loading, error } = usePatriarchs();

  return (
    <div className="min-h-screen archive-grid px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <History className="mx-auto mb-5 h-9 w-9 text-[#c6a15b]" />
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#c6a15b]">A journey through time</p>
          <h1 className="text-5xl font-bold text-[var(--ink)] md:text-6xl">{t('timeline.title')}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">{t('timeline.subtitle')}</p>
          <div className="mx-auto mt-6 h-1 w-20 bg-[#c6a15b]" />
        </div>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <InteractiveTimeline patriarchs={patriarchs} />
        )}
      </div>
    </div>
  );
}
