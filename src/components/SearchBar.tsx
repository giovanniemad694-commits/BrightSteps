import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full group">
      <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-5 rtl:right-5 w-5 h-5 text-[#c6a15b] transition-transform group-focus-within:scale-110" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="w-full pl-14 pr-12 rtl:pr-14 rtl:pl-12 py-4 rounded-xl border border-white/10 bg-[var(--surface)]/85 text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[#c6a15b] focus:ring-2 focus:ring-[#c6a15b]/15 focus:outline-none transition-all" />
      {value && <button onClick={() => onChange('')} className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 p-1 text-[var(--ink-muted)] hover:text-[#e0bd76]" aria-label="Clear search"><X className="w-4 h-4" /></button>}
    </div>
  );
}
