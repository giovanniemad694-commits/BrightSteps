import type { Patriarch } from '@/types';

export type FaithCategory =
  | 'faith_defense'
  | 'heresy'
  | 'teaching'
  | 'writings'
  | 'persecution'
  | 'service'
  | 'heritage';

export const FAITH_CATEGORIES: FaithCategory[] = [
  'faith_defense',
  'heresy',
  'teaching',
  'writings',
  'persecution',
  'service',
  'heritage',
];

const KEYWORDS: Record<FaithCategory, string[]> = {
  faith_defense: ['إيمان', 'دفاع', 'حافظ', 'ثبت', 'faith', 'defend', 'preserve'],
  heresy: ['بدعة', 'هرطقة', 'أريوس', 'نسطور', 'أوطاخي', 'heresy', 'arius', 'nestor'],
  teaching: ['تعليم', 'كنسي', 'عقيدة', 'تقليد', 'teaching', 'doctrine', 'tradition'],
  writings: ['كتاب', 'كتابات', 'مؤلف', 'رسائل', 'writings', 'book', 'letter', 'authored'],
  persecution: ['اضطهاد', 'نفي', 'سجن', 'تعذيب', 'persecution', 'exile', 'prison'],
  service: ['خدمة', 'كنيسة', 'رعاية', 'أبروشية', 'service', 'church', 'pastoral'],
  heritage: ['تراث', 'لغة', 'قبطي', 'عمارة', 'دير', 'heritage', 'language', 'coptic', 'monastery'],
};

export function categorizePatriarch(p: Patriarch): FaithCategory[] {
  const categories: FaithCategory[] = [];
  const haystack = [
    p.faith_defense_ar || '',
    p.biography_ar || '',
    p.contributions_ar || '',
    p.challenges_ar || '',
  ].join(' ').toLowerCase();

  for (const cat of FAITH_CATEGORIES) {
    if (KEYWORDS[cat].some((kw) => haystack.includes(kw.toLowerCase()))) {
      categories.push(cat);
    }
  }

  return categories.length > 0 ? categories : ['faith_defense'];
}

export function patriarchsByCategory(patriarchs: Patriarch[], category: FaithCategory): Patriarch[] {
  return patriarchs.filter((p) => categorizePatriarch(p).includes(category));
}
