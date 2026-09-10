import { ExternalLink, Book, FileText, Globe } from 'lucide-react';
import type { PatriarchSource } from '@/types';

interface SourceListProps {
  sources: PatriarchSource[];
}

const sourceIcon = (type: string) => {
  switch (type) {
    case 'book':
      return <Book className="w-5 h-5 text-[#c5a059]" />;
    case 'document':
      return <FileText className="w-5 h-5 text-[#c5a059]" />;
    case 'website':
      return <Globe className="w-5 h-5 text-[#c5a059]" />;
    default:
      return <Book className="w-5 h-5 text-[#c5a059]" />;
  }
};

export default function SourceList({ sources }: SourceListProps) {
  if (!sources.length) return null;

  return (
    <div className="space-y-3">
      {sources.map((source) => (
        <div
          key={source.id}
          className="flex items-start gap-3 rounded-xl border border-white/10 bg-[var(--surface)] p-4 transition-colors hover:border-[#c6a15b]"
        >
          <div className="mt-1">{sourceIcon(source.source_type)}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-[var(--ink)] text-sm">{source.title}</h4>
            {source.description && (
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{source.description}</p>
            )}
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#c6a15b] hover:text-[#e0bd76] mt-2 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {source.url}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
