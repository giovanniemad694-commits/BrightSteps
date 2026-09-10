export interface Patriarch {
  id: string;
  name_ar: string;
  name_en: string;
  papal_number: number;
  birth_date: string | null;
  death_date: string | null;
  papacy_start: string | null;
  papacy_end: string | null;
  century: number;
  short_bio_ar: string;
  biography_ar: string;
  historical_background_ar: string | null;
  faith_defense_ar: string | null;
  challenges_ar: string | null;
  contributions_ar: string | null;
  image_url: string | null;
  image_source: string | null;
  image_credit: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatriarchEvent {
  id: string;
  patriarch_id: string;
  title_ar: string;
  description_ar: string | null;
  event_date: string | null;
  event_year: number | null;
  sort_order: number;
  created_at: string;
}

export interface PatriarchSource {
  id: string;
  patriarch_id: string;
  title: string;
  url: string | null;
  source_type: string;
  description: string | null;
  created_at: string;
}

export interface PatriarchWithRelations extends Patriarch {
  events?: PatriarchEvent[];
  sources?: PatriarchSource[];
}

export type SortOption = 'papal_number_asc' | 'papal_number_desc' | 'century_asc' | 'name_ar_asc';
