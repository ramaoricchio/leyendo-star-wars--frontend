export interface Review {
  id: number;
  publication_id: number;
  publication?: import('./publication').Publication;
  score: number | null;  // 1-5, o null = sin puntaje
  text: string;
  excerpt?: string;
  date: string;
  youtube_url?: string;
  is_active?: boolean;
  created_at: string;
}
