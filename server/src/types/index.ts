// User type
export interface User {
    id: string;
    username: string;
    email: string;
    totalExp: number;
    level: number;
    createdAt: Date;
    updatedAt: Date;
    stats: UserStats;
  }
  
  // User stats
  export interface UserStats {
    financial: number;
    habits: number;
    knowledge: number;
    skills: number;
    experiences: number;
    network: number;
  }
  
  // Journal entry
  export interface JournalEntry {
    id: string;
    userId: string;
    content: string;
    processedContent?: string;
    date: Date;
    expGained: number;
    activities: Activity[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Activity extracted from journal
  export interface Activity {
    id: string;
    journalId: string;
    action: string;
    category: ActivityCategory;
    expValue: number;
    date: Date;
  }
  
  // Activity categories
  export type ActivityCategory = 'financial' | 'habits' | 'knowledge' | 'skills' | 'experiences' | 'network';
  
  // EXP History
  export interface ExpHistory {
    id: string;
    userId: string;
    date: Date;
    totalExp: number;
    levelUp: boolean;
    activities: Activity[];
  }
  
  // API Response format
  export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
  }