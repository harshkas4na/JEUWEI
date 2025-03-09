// src/hooks/use-journal.ts
import { useState } from 'react';
import { fetchWithAuth, ApiError } from '@/lib/api-client';
import { JournalEntry } from '@/app/types';
import { useAuth } from '@clerk/nextjs';

export function useJournal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken, isLoaded } = useAuth();

  const createJournalEntry = async (content: string): Promise<JournalEntry | null> => {
    if (!isLoaded) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWithAuth(
        '/api/journal', 
        {
          method: 'POST',
          body: JSON.stringify({ content }),
        },
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

  const getJournalEntries = async (limit = 10, offset = 0): Promise<JournalEntry[]> => {
    if (!isLoaded) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWithAuth(
        `/api/journal?limit=${limit}&offset=${offset}`,
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

  const getJournalEntry = async (id: string): Promise<JournalEntry | null> => {
    if (!isLoaded) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWithAuth(
        `/api/journal/${id}`,
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
    createJournalEntry,
    getJournalEntries,
    getJournalEntry,
    loading,
    error,
  };
}