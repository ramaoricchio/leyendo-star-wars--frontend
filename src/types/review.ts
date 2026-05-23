export interface Review {
  id: number;
  publication_id: number;
  publication?: import('./publication').Publication;
  score: number;  // 1-5
  text: string;
  excerpt?: string;
  date: string;
  youtube_url?: string;
  is_active?: boolean;
  created_at: string;
}
