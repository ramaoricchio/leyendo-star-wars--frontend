export interface Collection {
  id: number;
  name: string;
  description?: string;
  era?: string;
  is_canon: boolean;
  author?: string;
  publications?: import('./publication').Publication[];
  created_at: string;
  updated_at: string;
}
