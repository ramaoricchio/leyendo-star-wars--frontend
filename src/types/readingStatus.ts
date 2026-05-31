export type ReadingStatusValue = 'no_leido' | 'leyendo' | 'leido';

export interface ReadingStatus {
  publication_id: number;
  status: ReadingStatusValue;
  in_wishlist: boolean;
  updated_at: string | null;
}

export interface Badge {
  slug: string;
  name: string;
  description: string;
  earned: boolean;
}

export interface ProfileStats {
  leido: number;
  leyendo: number;
  wishlist: number;
}
