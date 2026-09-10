import { AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-xl font-bold text-[#4a1212] mb-2">{t('common.error')}</h3>
      <p className="text-gray-500 max-w-md mb-4">{message || t('common.error')}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          <RefreshCw className="w-4 h-4" />
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}
