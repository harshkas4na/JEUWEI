// src/services/journal.service.ts
import { JournalEntry } from '../types';
import { nlpService } from './nlp.service';
import { expService } from './exp.service';
import { dataStore } from './data.service';

export const journalService = {
  /**
   * Create a new journal entry
   */
  async createEntry(userId: string, content: string): Promise<JournalEntry> {
    // Process content with NLP service
    const processedContent = await nlpService.processText(content);
    
    // Extract activities
    const extractedActivities = await nlpService.extractActivities(processedContent);
    
    // Create a new journal entry
    const entryData: Omit<JournalEntry, 'id'> = {
      userId,
      content,
      processedContent,
      date: new Date(),
      expGained: 0, // Will be updated after EXP calculation
      activities: [], // Will be populated after activity creation
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const newEntry = dataStore.createJournalEntry(entryData);
    
    // Create activities
    const activities = extractedActivities.map(activity => 
      dataStore.createActivity({
        journalId: newEntry.id,
        action: activity.action,
        category: activity.category,
        expValue: activity.expValue,
        date: new Date()
      })
    );
    
    // Calculate EXP
    const expResult = await expService.calculateExp(userId, activities);
    
    // Update journal entry with EXP gained and activities
    newEntry.expGained = expResult.totalExp;
    newEntry.activities = activities;
    
    return newEntry;
  },
  
  /**
   * Get journal entries for a user
   */
  async getUserEntries(userId: string, limit = 10, offset = 0): Promise<JournalEntry[]> {
    return dataStore.getJournalEntries(userId, limit, offset);
  },
  
  /**
   * Get a specific journal entry
   */
  async getEntry(id: string, userId: string): Promise<JournalEntry | null> {
    return dataStore.getJournalEntry(id, userId);
  }
};