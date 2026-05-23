export type PubType = 'novela' | 'comic' | 'antologia' | 'audiolibro';
export type Canonicity = 'canon' | 'legends';
export type ToneKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export interface Publication {
  id: number;
  title: string;
  author: string;
  pub_type: PubType;
  isbn?: string;
  publisher?: string;
  year: number;
  description?: string;
  era: string;
  is_canon: boolean;
  collection_id?: number;
  cover_urls?: string[];
  buy_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
}
