import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, Book, FileText, Globe, Archive, GraduationCap, Scroll, ShieldCheck, Crown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAllSources } from '@/hooks/useSources';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { useReveal } from '@/hooks/useReveal';

const SOURCE_TYPE_META: Record<string, { icon: typeof Book; ar: string; en: string }> = {
  book: { icon: Book, ar: 'كتاب', en: 'Book' },
  document: { icon: FileText, ar: 'وثيقة', en: 'Document' },
  website: { icon: Globe, ar: 'موقع إلكتروني', en: 'Website' },
  archive: { icon: Archive, ar: 'أرشيف', en: 'Archive' },
  educational: { icon: GraduationCap, ar: 'مرجع تعليمي', en: 'Educational' },
  church: { icon: Scroll, ar: 'مصدر كنسي', en: 'Church Source' },
};

function getIcon(type: string) {
  return SOURCE_TYPE_META[type]?.icon || Book;
}

function getTypeLabel(type: string, language: 'ar' | 'en') {
  const meta = SOURCE_TYPE_META[type];
  if (!meta) return language === 'ar' ? 'مصدر' : 'Source';
  return language === 'ar' ? meta.ar : meta.en;
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal<HTMLElement>();
  return <section ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</section>;
}

export default function Sources() {
  const { t, language } = useLanguage();
  const { sources, loading, error } = useAllSources();
  const [filterType, setFilterType] = useState<string>('all');

  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of sources) {
      counts.set(s.source_type, (counts.get(s.source_type) || 0) + 1);
    }
    return counts;
  }, [sources]);

  const filtered = useMemo(() => {
    if (filterType === 'all') return sources;
    return sources.filter((s) => s.source_type === filterType);
  }, [sources, filterType]);

  const availableTypes = useMemo(() => Array.from(typeCounts.keys()), [typeCounts]);

  return (
    <div className="min-h-screen archive-grid px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <div className="mb-4 flex items-center justify-center">
            <BookOpen className="w-9 h-9 text-[#c6a15b]" />
          </div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
            {language === 'ar' ? 'التوثيق والمصداقية' : 'Documentation & Credibility'}
          </p>
          <h1 className="text-5xl font-bold text-[var(--ink)] md:text-6xl">{t('sources.title')}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">{t('sources.subtitle')}</p>
          <div className="mx-auto mt-6 h-1 w-20 bg-[#c6a15b]" />
        </div>

        <RevealSection className="mb-10">
          <div className="archive-surface rounded-3xl p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-[#e0bd76] shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-[var(--ink)] mb-3">{t('sources.why_important')}</h2>
                <p className="text-base leading-8 text-[var(--ink-soft)]">{t('sources.why_text')}</p>
              </div>
            </div>
          </div>
        </RevealSection>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-[var(--ink-soft)]">{t('sources.by_type')}:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'all' ? 'bg-[#c6a15b] text-[#0d1012]' : 'border border-white/10 text-[var(--ink-soft)] hover:border-[#c6a15b]'}`}
          >
            {t('sources.all_sources')} ({sources.length})
          </button>
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type ? 'bg-[#c6a15b] text-[#0d1012]' : 'border border-white/10 text-[var(--ink-soft)] hover:border-[#c6a15b]'}`}
            >
              {getTypeLabel(type, language)} ({typeCounts.get(type)})
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="w-16 h-16 text-[#c6a15b] mb-4" />
            <h3 className="text-xl font-bold text-[var(--ink)] mb-2">{t('sources.no_sources')}</h3>
            <p className="text-sm text-[var(--ink-muted)] max-w-md">{t('sources.no_sources_text')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((source, i) => {
              const Icon = getIcon(source.source_type);
              return (
                <div
                  key={source.id}
                  style={{ transitionDelay: `${Math.min(i, 8) * 50}ms` }}
                  className="archive-surface rounded-2xl p-5 card-hover"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 shrink-0 w-11 h-11 rounded-xl bg-[#48191d]/15 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#c6a15b]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-semibold text-[#c6a15b] uppercase tracking-wide">
                          {getTypeLabel(source.source_type, language)}
                        </span>
                      </div>
                      <h3 className="font-bold text-[var(--ink)] text-base mb-1">{source.title}</h3>
                      {source.description && (
                        <p className="text-sm text-[var(--ink-soft)] leading-7 mb-2">{source.description}</p>
                      )}
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-[#c6a15b] hover:text-[#e0bd76] transition-colors break-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          {source.url}
                        </a>
                      )}
                      {source.patriarch && (
                        <Link
                          to={`/patriarchs/${source.patriarch.id}`}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--ink-muted)] hover:text-[#e0bd76] transition-colors"
                        >
                          <Crown className="w-3.5 h-3.5 text-[#c6a15b]" />
                          {language === 'ar' ? source.patriarch.name_ar : source.patriarch.name_en}
                          <span className="text-xs text-[#c6a15b]">#{source.patriarch.papal_number}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && sources.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--ink-muted)]">
              {t('sources.total_sources')}: <span className="font-bold text-[#c6a15b]">{sources.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
