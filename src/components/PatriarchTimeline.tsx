import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar } from 'lucide-react';
import type { Patriarch } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import PatriarchImage from './PatriarchImage';
import { useReveal } from '@/hooks/useReveal';

interface PatriarchTimelineProps { patriarchs: Patriarch[]; }

function TimelineItem({ patriarch, index }: { patriarch: Patriarch; index: number }) {
  const { language } = useLanguage();
  const { ref, visible } = useReveal<HTMLAnchorElement>();
  const name = language === 'ar' ? patriarch.name_ar : patriarch.name_en;
  return (
    <Link ref={ref} to={`/patriarchs/${patriarch.id}`} style={{ transitionDelay: `${Math.min(index, 7) * 70}ms` }} className={`relative flex items-start gap-5 group reveal ${visible ? 'is-visible' : ''}`}>
      <div className="relative z-10 mt-5 h-4 w-4 shrink-0 rounded-full border-4 border-[var(--bg)] bg-[#c6a15b] shadow-[0_0_0_4px_rgba(198,161,91,.15)] group-hover:scale-125 transition-transform" />
      <div className="flex flex-1 items-center gap-4 rounded-2xl border border-white/10 bg-[var(--surface)] p-4 card-hover md:p-5">
        <PatriarchImage src={patriarch.image_url} alt={name} className="hidden h-16 w-16 shrink-0 rounded-xl sm:block" />
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold text-[#e0bd76]">#{patriarch.papal_number}</span><span className="text-xs text-[var(--ink-muted)]">{language === 'ar' ? `القرن ${patriarch.century}` : `Century ${patriarch.century}`}</span></div><h3 className="font-bold text-[var(--ink)] group-hover:text-[#e0bd76] transition-colors truncate">{name}</h3><p className="mt-1 flex items-center gap-1 text-xs text-[var(--ink-muted)]"><Calendar className="w-3 h-3 text-[#c6a15b]" />{[patriarch.papacy_start, patriarch.papacy_end || patriarch.death_date].filter(Boolean).join(' — ')}</p></div>
        <ChevronLeft className="w-5 h-5 shrink-0 text-[#c6a15b] rtl:rotate-180" />
      </div>
    </Link>
  );
}

export default function PatriarchTimeline({ patriarchs }: PatriarchTimelineProps) {
  return <div className="relative"><div className="absolute ltr:left-[7px] rtl:right-[7px] top-5 bottom-5 w-px bg-gradient-to-b from-transparent via-[#c6a15b] to-transparent" /><div className="space-y-5">{patriarchs.map((patriarch, index) => <TimelineItem key={patriarch.id} patriarch={patriarch} index={index} />)}</div></div>;
}
