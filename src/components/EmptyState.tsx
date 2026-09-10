import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <SearchX className="w-16 h-16 text-[#c5a059] mb-4" />
      <h3 className="text-xl font-bold text-[#4a1212] mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
    </div>
  );
}
