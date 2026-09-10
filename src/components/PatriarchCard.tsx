import { Link } from 'react-router-dom';
import { Calendar, ChevronLeft, Crown } from 'lucide-react';
import type { Patriarch } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import PatriarchImage from './PatriarchImage';
import { useReveal } from '@/hooks/useReveal';

interface PatriarchCardProps { patriarch: Patriarch; index?: number; }

export default function PatriarchCard({ patriarch, index = 0 }: PatriarchCardProps) {
  const { language } = useLanguage();
  const { ref, visible } = useReveal<HTMLAnchorElement>();
  const name = language === 'ar' ? patriarch.name_ar : patriarch.name_en;
  const papacyPeriod = [patriarch.papacy_start, patriarch.papacy_end || patriarch.death_date].filter(Boolean).join(' — ');

  return (
    <Link ref={ref} to={`/patriarchs/${patriarch.id}`} style={{ transitionDelay: `${Math.min(index, 5) * 70}ms` }} className={`group block overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)] card-hover reveal ${visible ? 'is-visible' : ''}`}>
      <div className="relative h-64 overflow-hidden bg-[#48191d]">
        <PatriarchImage src={patriarch.image_url} alt={name} className="w-full h-full transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1012] via-transparent to-transparent opacity-80" />
        <div className="absolute top-4 ltr:right-4 rtl:left-4 flex items-center gap-1.5 rounded-full border border-[#e0bd76]/50 bg-[#0d1012]/70 px-3 py-1 text-xs font-bold text-[#e0bd76] backdrop-blur-sm"><Crown className="w-3.5 h-3.5" />#{patriarch.papal_number}</div>
        <div className="absolute bottom-4 ltr:left-5 rtl:right-5 ltr:right-5 rtl:left-5"><p className="text-[10px] uppercase tracking-[0.2em] text-[#e0bd76]">Coptic Patriarch</p><h3 className="text-xl font-bold text-[#f5efe1] mt-1">{name}</h3></div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)] mb-3"><Calendar className="w-3.5 h-3.5 text-[#c6a15b]" /><span>{papacyPeriod || '—'}</span><span className="text-[#c6a15b]">·</span><span>{language === 'ar' ? `القرن ${patriarch.century}` : `Century ${patriarch.century}`}</span></div>
        <p className="text-sm leading-7 text-[var(--ink-soft)] line-clamp-3 mb-5">{patriarch.short_bio_ar}</p>
        <div className="flex items-center justify-between text-sm font-bold text-[#c6a15b] group-hover:text-[#e0bd76] transition-colors"><span>{language === 'ar' ? 'قراءة السيرة' : 'Read biography'}</span><ChevronLeft className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" /></div>
      </div>
    </Link>
  );
}
