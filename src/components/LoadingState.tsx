import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoadingState() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-[#c5a059] animate-spin mb-4" />
      <p className="text-gray-500">{t('common.loading')}</p>
    </div>
  );
}
