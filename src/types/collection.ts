export interface Collection {
  id: number;
  name: string;
  description?: string;
  era?: string;
  is_canon: boolean;
  author?: string;
  cover_tone?: string;
  featured_pub_ids?: number[];
  featured_cover_urls?: string[];
  publications?: import('./publication').Publication[];
  created_at: string;
  updated_at: string;
}
