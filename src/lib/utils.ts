export function formatCurrency(amount: number, currency: string = 'EGP'): string {
  const symbol = currency === 'EGP' ? 'EGP' : currency;
  return `${amount.toFixed(amount % 1 === 0 ? 0 : 2)} ${symbol}`;
}

export function formatDate(dateStr: string | null, locale: string = 'en'): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const localeCode = locale === 'ar' ? 'ar-EG' : 'en-US';
  return date.toLocaleDateString(localeCode, { month: 'short', day: 'numeric' });
}

export function formatDateTime(dateStr: string, locale: string = 'en'): string {
  const date = new Date(dateStr);
  const localeCode = locale === 'ar' ? 'ar-EG' : 'en-US';
  return date.toLocaleDateString(localeCode, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function getGreeting(locale: string = 'en'): string {
  const hour = new Date().getHours();
  if (locale === 'ar') {
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء الخير';
  }
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function getRewardDisplay(
  rewardType: string,
  amount: number,
  unit: string,
  currency: string = 'EGP',
): string {
  switch (rewardType) {
    case 'points':
      return `+${amount} ⭐`;
    case 'money':
      return `+${formatCurrency(amount, currency)}`;
    case 'screen_time':
      return `+${amount} ${unit || 'min'}`;
    case 'custom':
      return unit || '🎁';
    default:
      return `+${amount}`;
  }
}

export function getCostDisplay(cost: number, costUnit: string, currency: string = 'EGP'): string {
  if (costUnit === 'points') return `${cost} ⭐`;
  if (costUnit === 'money') return formatCurrency(cost, currency);
  if (costUnit === 'screen_time') return `${cost} min`;
  return `${cost} ${costUnit}`;
}
