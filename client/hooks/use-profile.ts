// src/hooks/use-profile.ts
import { useState } from 'react';
import { fetchWithAuth, ApiError } from '@/lib/api-client';
import { UserProfile } from '@/app/types';
import { useAuth } from '@clerk/nextjs';

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken, isLoaded } = useAuth();

  const getUserProfile = async (): Promise<UserProfile | null> => {
    if (!isLoaded) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWithAuth(
        '/api/user/profile',
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

  return {
    getUserProfile,
    loading,
    error,
  };
}