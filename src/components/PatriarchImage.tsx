import { useState } from 'react';
import { UserRound } from 'lucide-react';

interface PatriarchImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  onError?: () => void;
}

export default function PatriarchImage({ src, alt, className = '', onError }: PatriarchImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');

  if (!src || status === 'error') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#48191d] via-[#762525] to-[#171d20] ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 coptic-cross-pattern opacity-70" />
        <div className="relative text-center p-4">
          <UserRound className="w-12 h-12 text-[#c6a15b] mx-auto mb-2" />
          <p className="text-[#e0bd76] text-sm font-semibold leading-tight">{alt}</p>
          <p className="text-[#c8c1b4] text-[10px] mt-1">Archive portrait unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#171d20] ${className}`}>
      {status === 'loading' && <div className="absolute inset-0 skeleton" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setStatus('loaded')}
        onError={() => {
          setStatus('error');
          onError?.();
        }}
        className={`w-full h-full object-cover object-top transition-opacity duration-700 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
