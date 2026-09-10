import { usePatriarchs } from '@/hooks/usePatriarchs';
import FaithPreserved from '@/components/FaithPreserved';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';

export default function FaithPage() {
  const { patriarchs, loading, error } = usePatriarchs();

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="py-20"><LoadingState /></div>
      ) : error ? (
        <div className="py-20"><ErrorState message={error} /></div>
      ) : (
        <FaithPreserved patriarchs={patriarchs} isPage />
      )}
    </div>
  );
}
