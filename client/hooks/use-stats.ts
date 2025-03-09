// src/hooks/use-stats.ts
import { useState } from 'react';
import { fetchWithAuth, ApiError } from '@/lib/api-client';
import { UserStats, Activity } from '@/app/types';
import { useAuth } from '@clerk/nextjs';

export function useStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken, isLoaded } = useAuth();

  const getUserStats = async (): Promise<UserStats | null> => {
    if (!isLoaded) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWithAuth(
        '/api/stats/exp',
        {},
        getToken
      );
      
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'An error occurred';
      
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  const getRecentActivities = async (limit = 10): Promise<Activity[]> => {
    if (!isLoaded) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWithAuth(
        `/api/stats/activities?limit=${limit}`,
        {},
        getToken
      );
      
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'An error occurred';
      
      setError(errorMessage);
      setLoading(false);
      return [];
    }
  };

  return {
    getUserStats,
    getRecentActivities,
    loading,
    error,
  };
}