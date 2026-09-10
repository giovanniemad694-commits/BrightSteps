import { Link } from 'react-router-dom';
import { Search, BookOpen, Calendar, Users, BookMarked, ChevronLeft, Quote, ArrowDown, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatriarchs, useStats } from '@/hooks/usePatriarchs';
import { useReveal } from '@/hooks/useReveal';
import PatriarchCard from '@/components/PatriarchCard';
import FeaturedPatriarch from '@/components/FeaturedPatriarch';
import JourneyThroughHistory from '@/components/JourneyThroughHistory';
import FaithPreserved from '@/components/FaithPreserved';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';

const heroImage = 'https://images.pexels.com/photos/31162449/pexels-photo-31162449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal<HTMLElement>();
  return <section ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</section>;
}

export default function Home() {
  const { t, language } = useLanguage();
  const { patriarchs, loading, error } = usePatriarchs();
  const { stats } = useStats(patriarchs);
  const featured = patriarchs.slice(0, 6);

  const featuredPatriarch = patriarchs.length > 0
    ? patriarchs[Math.floor(Date.now() / 86400000) % patriarchs.length]
    : null;

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden bg-[#0d1012] text-white">
        <img src={heroImage} alt="Candlelit Orthodox ceremony" className="absolute inset-0 h-full w-full object-cover opacity-35 hero-drift" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(118,37,37,.32),transparent_45%),linear-gradient(90deg,rgba(13,16,18,.98),rgba(13,16,18,.64),rgba(13,16,18,.9))]" />
        <div className="absolute inset-0 coptic-cross-pattern opacity-50" />
        <div className="absolute top-0 ltr:left-0 rtl:right-0 h-full w-1 bg-gradient-to-b from-transparent via-[#c6a15b] to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-8 flex items-center gap-4 slide-up"><span className="h-px w-16 bg-[#c6a15b]" /><span className="text-xs uppercase tracking-[0.28em] text-[#e0bd76]">Coptic Orthodox Archive</span></div>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] text-[#f5efe1] sm:text-6xl lg:text-8xl slide-up" style={{ animationDelay: '90ms' }}>{t('hero.title')}</h1>
            <div className="gold-divider my-8 w-32 slide-up" style={{ animationDelay: '160ms' }} />
            <p className="max-w-2xl text-lg leading-9 text-[#d8d0c1] sm:text-xl slide-up" style={{ animationDelay: '230ms' }}>{t('hero.subtitle')}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row slide-up" style={{ animationDelay: '300ms' }}>
              <Link to="/patriarchs" className="btn-primary"><Search className="h-5 w-5" />{t('hero.cta.explore')}</Link>
              <Link to="/patriarchs" className="btn-secondary"><BookOpen className="h-5 w-5" />{t('hero.cta.search')}</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-[#c6a15b] animate-bounce"><span className="mb-2 block text-[10px] uppercase tracking-[0.3em]">Scroll to explore</span><ArrowDown className="mx-auto h-4 w-4" /></div>
      </section>

      <RevealSection className="archive-grid border-b border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div><p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#c6a15b]">01 — The archive</p><h2 className="section-title">{t('home.intro.title')}</h2></div>
          <p className="max-w-3xl text-lg leading-9 text-[var(--ink-soft)]">{t('home.intro.text')}</p>
        </div>
      </RevealSection>

      {loading ? null : error ? null : <FeaturedPatriarch patriarch={featuredPatriarch} />}

      <RevealSection className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl"><div className="mb-12 flex items-end justify-between gap-4"><div><p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#c6a15b]">02 — Featured records</p><h2 className="section-title mb-0">{t('home.featured.title')}</h2></div><Link to="/patriarchs" className="hidden items-center gap-1 text-sm font-bold text-[#c6a15b] hover:text-[#e0bd76] sm:flex">{t('home.explore.title')}<ChevronLeft className="h-4 w-4 rtl:rotate-180" /></Link></div>{loading ? <LoadingState /> : error ? <ErrorState message={error} /> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((p, i) => <PatriarchCard key={p.id} patriarch={p} index={i} />)}</div>}<div className="mt-10 text-center sm:hidden"><Link to="/patriarchs" className="btn-primary">{t('home.explore.title')}<ChevronLeft className="h-5 w-5 rtl:rotate-180" /></Link></div></div>
      </RevealSection>

      <section className="relative bg-[#111619] py-20 text-white coptic-cross-pattern"><div className="absolute inset-0 bg-gradient-to-b from-[#762525]/10 to-transparent" /><div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-12 text-center"><p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#c6a15b]">03 — By the numbers</p><h2 className="text-3xl font-bold text-[#f5efe1] md:text-4xl">{t('home.stats.title')}</h2></div><div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">{[{ icon: Users, label: t('home.stats.patriarchs'), value: stats.patriarchs }, { icon: Calendar, label: t('home.stats.centuries'), value: stats.centuries }, { icon: BookMarked, label: t('home.stats.events'), value: stats.events }, { icon: BookOpen, label: t('home.stats.sources'), value: stats.sources }].map((stat) => <div key={stat.label} className="archive-surface rounded-2xl p-6 text-center"><stat.icon className="mx-auto mb-4 h-7 w-7 text-[#c6a15b]" /><div className="text-4xl font-bold text-[#f5efe1]">{stat.value}</div><div className="mt-2 text-xs text-[#8e918c]">{stat.label}</div></div>)}</div></div></section>

      {!loading && !error && patriarchs.length > 0 && <JourneyThroughHistory patriarchs={patriarchs} />}

      <RevealSection className="px-4 py-24 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><div className="mb-12 text-center"><p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#c6a15b]">04 — Across the centuries</p><h2 className="section-title inline-block">{t('home.timeline.title')}</h2></div><div className="archive-surface rounded-3xl p-5 sm:p-8"><div className="space-y-2">{patriarchs.slice(0, 5).map((p, i) => <Link key={p.id} to={`/patriarchs/${p.id}`} className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c6a15b]/50 text-sm font-bold text-[#e0bd76]">{p.papal_number}</span><span className="min-w-0 flex-1"><span className="block truncate font-bold text-[var(--ink)] group-hover:text-[#e0bd76]">{language === 'ar' ? p.name_ar : p.name_en}</span><span className="text-xs text-[var(--ink-muted)]">{[p.papacy_start, p.papacy_end || p.death_date].filter(Boolean).join(' — ')}</span></span><span className="text-xs text-[#c6a15b]">0{i + 1}</span></Link>)}</div><div className="mt-6 text-center"><Link to="/timeline" className="text-sm font-bold text-[#c6a15b] hover:text-[#e0bd76]">{language === 'ar' ? 'عرض الخط الزمني الكامل' : 'View full timeline'} <ChevronLeft className="inline h-4 w-4 rtl:rotate-180" /></Link></div></div></div></RevealSection>

      {!loading && !error && patriarchs.length > 0 && <FaithPreserved patriarchs={patriarchs} />}

      <RevealSection className="border-y border-white/5 bg-[var(--surface)] px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3"><div className="rounded-2xl border border-[#c6a15b]/25 bg-[#762525]/10 p-7"><ShieldCheck className="mb-6 h-8 w-8 text-[#c6a15b]" /><h2 className="mb-4 text-2xl font-bold text-[var(--ink)]">{t('home.about.title')}</h2><p className="text-sm leading-8 text-[var(--ink-soft)]">{t('home.about.text')}</p></div><div className="rounded-2xl border border-white/10 p-7"><Sparkles className="mb-6 h-8 w-8 text-[#c6a15b]" /><h2 className="mb-4 text-2xl font-bold text-[var(--ink)]">{language === 'ar' ? 'لماذا هذا الأرشيف؟' : 'Why this archive?'}</h2><p className="text-sm leading-8 text-[var(--ink-soft)]">{language === 'ar' ? 'لأن تاريخ الكنيسة ليس مجرد تواريخ، بل شهادات حيّة لأشخاص حفظوا الإيمان وسط التحولات والاضطهادات والصعوبات.' : 'Because church history is more than dates; it is a living record of people who preserved faith through change, persecution, and challenge.'}</p></div><div className="rounded-2xl border border-white/10 p-7"><Quote className="mb-6 h-8 w-8 text-[#c6a15b]" /><h2 className="mb-4 text-2xl font-bold text-[var(--ink)]">{t('home.sources.title')}</h2><p className="text-sm leading-8 text-[var(--ink-soft)]">{t('home.sources.text')}</p></div></div></RevealSection>
    </div>
  );
}
