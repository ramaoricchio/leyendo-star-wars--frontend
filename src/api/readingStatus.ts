import api from './axios';
import { ReadingStatus, ReadingStatusValue, Badge, ProfileStats } from '../types/readingStatus';
import { Publication } from '../types/publication';
import { User } from '../types/user';

export interface ReadBook extends Publication {
  personal_score: number | null;
}

export interface UserProfile {
  user: User;
  stats: ProfileStats;
  in_progress: Publication[];
  wishlist: Publication[];
  read_books: ReadBook[];
  badges: Badge[];
}

export async function getMyStatuses(): Promise<ReadingStatus[]> {
  const res = await api.get('/reading-status');
  return res.data.data as ReadingStatus[];
}

export async function setStatus(
  pubId: number,
  data: { status?: ReadingStatusValue; in_wishlist?: boolean; personal_score?: number | null }
): Promise<ReadingStatus> {
  const res = await api.put(`/reading-status/${pubId}`, data);
  return res.data.data as ReadingStatus;
}

export async function getCommunityAvg(pubId: number): Promise<{ avg: number | null; count: number }> {
  const res = await api.get(`/reading-status/community/${pubId}`);
  return res.data.data as { avg: number | null; count: number };
}

export async function getMyProfile(): Promise<UserProfile> {
  const res = await api.get('/users/me/profile');
  return res.data.data as UserProfile;
}
