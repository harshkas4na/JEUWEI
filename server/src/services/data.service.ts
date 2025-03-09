// src/services/data.service.ts
import { JournalEntry, UserStats, Activity, ActivityCategory } from '../types';

// In-memory data store
class DataStore {
  private users: Map<string, {
    totalExp: number;
    stats: Record<ActivityCategory, number>;
  }>;
  
  private journals: Map<string, JournalEntry>;
  private activities: Map<string, Activity>;
  
  private journalIdCounter: number;
  private activityIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.journals = new Map();
    this.activities = new Map();
    this.journalIdCounter = 1;
    this.activityIdCounter = 1;
  }
  
  // User methods
  getUserStats(userId: string): { totalExp: number; stats: Record<ActivityCategory, number> } {
    if (!this.users.has(userId)) {
      const defaultStats = {
        totalExp: 0,
        stats: {
          financial: 0,
          habits: 0,
          knowledge: 0,
          skills: 0,
          experiences: 0,
          network: 0
        }
      };
      this.users.set(userId, defaultStats);
    }
    
    return this.users.get(userId)!;
  }
  
  updateUserStats(
    userId: string, 
    expGained: number, 
    categoryExp: Record<ActivityCategory, number>
  ): void {
    const userStats = this.getUserStats(userId);
    
    userStats.totalExp += expGained;
    
    for (const [category, exp] of Object.entries(categoryExp)) {
      userStats.stats[category as ActivityCategory] += exp;
    }
    
    this.users.set(userId, userStats);
  }
  
  // Journal methods
  createJournalEntry(entry: Omit<JournalEntry, 'id'>): JournalEntry {
    const id = `journal-${this.journalIdCounter++}`;
    const newEntry = { ...entry, id };
    
    this.journals.set(id, newEntry);
    
    return newEntry;
  }
  
  getJournalEntries(userId: string, limit: number, offset: number): JournalEntry[] {
    return Array.from(this.journals.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(offset, offset + limit);
  }
  
  getJournalEntry(id: string, userId: string): JournalEntry | null {
    const entry = this.journals.get(id);
    
    if (!entry || entry.userId !== userId) {
      return null;
    }
    
    return entry;
  }
  
  // Activity methods
  createActivity(activity: Omit<Activity, 'id'>): Activity {
    const id = `activity-${this.activityIdCounter++}`;
    const newActivity = { ...activity, id };
    
    this.activities.set(id, newActivity);
    
    return newActivity;
  }
  
  getActivitiesByJournalId(journalId: string): Activity[] {
    return Array.from(this.activities.values())
      .filter(activity => activity.journalId === journalId);
  }
  
  getRecentActivities(userId: string, limit: number): Activity[] {
    const userJournalIds = Array.from(this.journals.values())
      .filter(entry => entry.userId === userId)
      .map(entry => entry.id);
    
    return Array.from(this.activities.values())
      .filter(activity => userJournalIds.includes(activity.journalId))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }
}

// Export singleton instance
export const dataStore = new DataStore();