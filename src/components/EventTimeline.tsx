import { Calendar } from 'lucide-react';
import type { PatriarchEvent } from '@/types';

interface EventTimelineProps {
  events: PatriarchEvent[];
}

export default function EventTimeline({ events }: EventTimelineProps) {
  if (!events.length) return null;

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute ltr:left-5 rtl:right-5 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c6a15b] to-transparent" />

      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="relative flex items-start gap-4 slide-up">
            {/* Dot */}
            <div className="absolute ltr:left-3 rtl:right-3 top-5 w-4 h-4 rounded-full bg-[#c6a15b] border-4 border-[var(--bg)] z-10 shadow-[0_0_0_4px_rgba(198,161,91,.14)]" />

            {/* Content */}
            <div className="ltr:ml-12 rtl:mr-12 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#c5a059]" />
                <span className="text-sm font-semibold text-[#c6a15b]">
                  {event.event_date || (event.event_year ? `${event.event_year} م` : '—')}
                </span>
              </div>
              <h4 className="font-bold text-[var(--ink)] mb-1">{event.title_ar}</h4>
              {event.description_ar && (
                <p className="text-sm text-gray-600 leading-relaxed">{event.description_ar}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
