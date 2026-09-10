import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Crown, Shield, BookOpen, Scroll, Award, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatriarchDetail } from '@/hooks/usePatriarchs';
import PatriarchImage from '@/components/PatriarchImage';
import EventTimeline from '@/components/EventTimeline';
import SourceList from '@/components/SourceList';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { useReveal } from '@/hooks/useReveal';

function DetailSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal<HTMLElement>();
  return <section ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</section>;
}

export default function PatriarchDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { patriarch, events, sources, loading, error } = usePatriarchDetail(id);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={t('details.error')} />;
  if (!patriarch) return <div className="py-20 text-center"><p className="mb-4 text-xl text-[var(--ink-muted)]">{t('details.not_found')}</p><Link to="/patriarchs" className="btn-primary"><ArrowLeft className="h-5 w-5 rtl:rotate-180" />{t('details.back')}</Link></div>;

  const name = language === 'ar' ? patriarch.name_ar : patriarch.name_en;
  const papacyPeriod = [patriarch.papacy_start, patriarch.papacy_end || patriarch.death_date].filter(Boolean).join(' — ');
  const infoItems = [{ label: t('details.papal_number'), value: `#${patriarch.papal_number}` }, { label: t('details.century'), value: `${patriarch.century}` }, { label: t('details.birth'), value: patriarch.birth_date || '—' }, { label: t('details.death'), value: patriarch.death_date || '—' }, { label: t('details.papacy'), value: papacyPeriod || '—' }];

  return <div className="fade-in"><section className="relative overflow-hidden bg-[#0d1012] text-white"><div className="absolute inset-0 coptic-cross-pattern opacity-40" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(118,37,37,.28),transparent_40%)]" /><div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><Link to="/patriarchs" className="mb-10 inline-flex items-center gap-2 text-sm text-[#c8c1b4] hover:text-[#e0bd76]"><ArrowLeft className="h-5 w-5 rtl:rotate-180" />{t('details.back')}</Link><div className="grid items-center gap-10 md:grid-cols-[minmax(260px,380px)_1fr]"><div><div className="overflow-hidden rounded-3xl border border-[#c6a15b]/50 shadow-2xl shadow-black/40"><PatriarchImage src={patriarch.image_url} alt={name} className="h-[360px] w-full object-cover" /></div>{patriarch.image_credit && <p className="mt-3 text-center text-xs text-[#8e918c]">{patriarch.image_credit}</p>}</div><div><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c6a15b]/50 bg-[#c6a15b]/10 px-4 py-1.5 text-xs font-bold text-[#e0bd76]"><Crown className="h-3.5 w-3.5" />{t('details.papal_number')} {patriarch.papal_number}</div><h1 className="text-4xl font-bold leading-tight text-[#f5efe1] md:text-6xl">{name}</h1><div className="gold-divider my-6 w-24" /><p className="max-w-2xl text-lg leading-9 text-[#c8c1b4]">{patriarch.short_bio_ar}</p><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">{infoItems.map((item) => <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="mb-1 text-[10px] uppercase tracking-wide text-[#8e918c]">{item.label}</p><p className="text-sm font-semibold text-[#e0bd76]">{item.value}</p></div>)}</div></div></div></div></section>

    <div className="mx-auto max-w-4xl space-y-16 px-4 py-16 sm:px-6"><DetailSection><div className="mb-5 flex items-center gap-3"><BookOpen className="h-7 w-7 text-[#c6a15b]" /><h2 className="text-3xl font-bold text-[var(--ink)]">{t('details.biography')}</h2></div><div className="gold-divider mb-7" /><p className="text-lg leading-10 text-[var(--ink-soft)] whitespace-pre-line">{patriarch.biography_ar}</p></DetailSection>
      {patriarch.historical_background_ar && <DetailSection><div className="mb-5 flex items-center gap-3"><Scroll className="h-7 w-7 text-[#c6a15b]" /><h2 className="text-3xl font-bold text-[var(--ink)]">{t('details.historical_background')}</h2></div><div className="gold-divider mb-7" /><p className="text-lg leading-10 text-[var(--ink-soft)] whitespace-pre-line">{patriarch.historical_background_ar}</p></DetailSection>}
      {patriarch.faith_defense_ar && <DetailSection className="rounded-3xl border border-[#c6a15b]/30 bg-gradient-to-br from-[#48191d] to-[#171d20] p-7 shadow-2xl sm:p-10"><div className="mb-5 flex items-center gap-3"><Shield className="h-8 w-8 text-[#e0bd76]" /><h2 className="text-2xl font-bold text-[#e0bd76] md:text-3xl">{t('details.faith_defense')}</h2></div><div className="mb-7 h-px w-20 bg-[#c6a15b]" /><p className="text-lg leading-10 text-[#f5efe1] whitespace-pre-line">{patriarch.faith_defense_ar}</p></DetailSection>}
      <div className="grid gap-10 md:grid-cols-2"><DetailSection>{patriarch.challenges_ar && <><div className="mb-5 flex items-center gap-3"><AlertTriangle className="h-7 w-7 text-[#c6a15b]" /><h2 className="text-2xl font-bold text-[var(--ink)]">{t('details.challenges')}</h2></div><div className="gold-divider mb-5" /><p className="leading-9 text-[var(--ink-soft)]">{patriarch.challenges_ar}</p></>}</DetailSection><DetailSection>{patriarch.contributions_ar && <><div className="mb-5 flex items-center gap-3"><Award className="h-7 w-7 text-[#c6a15b]" /><h2 className="text-2xl font-bold text-[var(--ink)]">{t('details.contributions')}</h2></div><div className="gold-divider mb-5" /><p className="leading-9 text-[var(--ink-soft)]">{patriarch.contributions_ar}</p></>}</DetailSection></div>
      {events.length > 0 && <DetailSection><div className="mb-7 flex items-center gap-3"><Calendar className="h-7 w-7 text-[#c6a15b]" /><h2 className="text-3xl font-bold text-[var(--ink)]">{t('details.events')}</h2></div><div className="gold-divider mb-8" /><EventTimeline events={events} /></DetailSection>}
      {sources.length > 0 && <DetailSection><div className="mb-7 flex items-center gap-3"><Crown className="h-7 w-7 text-[#c6a15b]" /><h2 className="text-3xl font-bold text-[var(--ink)]">{t('details.sources')}</h2></div><div className="gold-divider mb-7" /><SourceList sources={sources} /></DetailSection>}
      <div className="pt-4 text-center"><Link to="/patriarchs" className="btn-primary"><ArrowLeft className="h-5 w-5 rtl:rotate-180" />{t('details.back')}</Link></div>
    </div>
  </div>;
}
