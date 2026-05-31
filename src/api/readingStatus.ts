import api from './axios';
import { ReadingStatus, ReadingStatusValue, Badge, ProfileStats } from '../types/readingStatus';
import { Publication } from '../types/publication';
import { User } from '../types/user';

export interface UserProfile {
  user: User;
  stats: ProfileStats;
  in_progress: Publication[];
  wishlist: Publication[];
  badges: Badge[];
}

export async function getMyStatuses(): Promise<ReadingStatus[]> {
  const res = await api.get('/reading-status');
  return res.data.data as ReadingStatus[];
}

export async function setStatus(
  pubId: number,
  data: { status?: ReadingStatusValue; in_wishlist?: boolean }
): Promise<ReadingStatus> {
  const res = await api.put(`/reading-status/${pubId}`, data);
  return res.data.data as ReadingStatus;
}

export async function getMyProfile(): Promise<UserProfile> {
  const res = await api.get('/users/me/profile');
  return res.data.data as UserProfile;
}
