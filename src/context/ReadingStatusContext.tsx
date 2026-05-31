import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ReadingStatus, ReadingStatusValue } from '../types/readingStatus';
import { getMyStatuses, setStatus as apiSetStatus } from '../api/readingStatus';
import { useAuth } from './AuthContext';

interface ReadingStatusContextType {
  statuses: Record<number, ReadingStatus>;
  getStatus: (pubId: number) => ReadingStatus | null;
  updateStatus: (pubId: number, data: { status?: ReadingStatusValue; in_wishlist?: boolean; personal_score?: number | null }) => Promise<void>;
  isLoaded: boolean;
}

const ReadingStatusContext = createContext<ReadingStatusContextType | null>(null);

export const ReadingStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [statuses, setStatuses] = useState<Record<number, ReadingStatus>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setStatuses({});
      setIsLoaded(false);
      return;
    }
    getMyStatuses()
      .then((list) => {
        const map: Record<number, ReadingStatus> = {};
        list.forEach((s) => { map[s.publication_id] = s; });
        setStatuses(map);
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, [isAuthenticated]);

  const getStatus = useCallback(
    (pubId: number): ReadingStatus | null => statuses[pubId] ?? null,
    [statuses]
  );

  const updateStatus = useCallback(
    async (pubId: number, data: { status?: ReadingStatusValue; in_wishlist?: boolean; personal_score?: number | null }) => {
      // Optimistic update
      setStatuses((prev) => ({
        ...prev,
        [pubId]: {
          publication_id: pubId,
          status: data.status ?? prev[pubId]?.status ?? 'no_leido',
          in_wishlist: data.in_wishlist ?? prev[pubId]?.in_wishlist ?? false,
          personal_score: data.personal_score !== undefined ? data.personal_score : prev[pubId]?.personal_score ?? null,
          updated_at: new Date().toISOString(),
        },
      }));
      try {
        const updated = await apiSetStatus(pubId, data);
        setStatuses((prev) => ({ ...prev, [pubId]: updated }));
      } catch {
        // Revert on error — refetch
        getMyStatuses()
          .then((list) => {
            const map: Record<number, ReadingStatus> = {};
            list.forEach((s) => { map[s.publication_id] = s; });
            setStatuses(map);
          })
          .catch(() => {});
      }
    },
    []
  );

  return (
    <ReadingStatusContext.Provider value={{ statuses, getStatus, updateStatus, isLoaded }}>
      {children}
    </ReadingStatusContext.Provider>
  );
};

export const useReadingStatus = () => {
  const ctx = useContext(ReadingStatusContext);
  if (!ctx) throw new Error('useReadingStatus must be used within ReadingStatusProvider');
  return ctx;
};
