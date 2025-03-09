// src/types/index.ts
export interface UserProfile {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    username: string;
    imageUrl: string | null;
    level: number;
    totalExp: number;
    progress: number;
    nextLevelExp: number;
  }
  
  export interface UserStats {
    level: number;
    totalExp: number;
    nextLevelExp: number;
    progress: number;
    stats: {
      financial: number;
      habits: number;
      knowledge: number;
      skills: number;
      experiences: number;
      network: number;
    };
    recentActivities: Activity[];
  }
  
  export interface JournalEntry {
    id: string;
    userId: string;
    content: string;
    processedContent?: string;
    date: string;
    expGained: number;
    activities: Activity[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Activity {
    id: string;
    journalId: string;
    action: string;
    category: ActivityCategory;
    expValue: number;
    date: string;
  }
  
  export type ActivityCategory = 'financial' | 'habits' | 'knowledge' | 'skills' | 'experiences' | 'network';