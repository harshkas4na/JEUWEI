// src/services/journal.service.ts
import { JournalEntry, IJournalEntry } from '../models/journal.model';
import { User } from '../models/user.model';
import { ExpHistory } from '../models/exp.model';
import { nlpService } from './nlp.service';
import { expService } from './exp.service';
import { AppError } from '../middlewares/error.middleware';
import { logger } from '../utils/logger.util';
import { ActivityCategory } from '../types';

export const journalService = {
  /**
   * Create a new journal entry
   */
  async createEntry(userId: string, content: string): Promise<IJournalEntry> {
    try {
      // Check if user exists
      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      // Process content with NLP service
      const processedContent = await nlpService.processText(content);
      
      // Extract activities
      const extractedActivities = await nlpService.extractActivities(processedContent);
      
      // Create a new journal entry
      const newEntry = new JournalEntry({
        userId: user.id,
        content,
        processedContent,
        date: new Date(),
        expGained: 0, // Will be updated after EXP calculation
        activities: [] // Will be populated after activity creation
      });
      
      // Add activities to the journal entry
      extractedActivities.forEach(activity => {
        newEntry.activities.push({
          action: activity.action,
          category: activity.category,
          expValue: activity.expValue,
          date: new Date()
        });
      });
      
      // Calculate total EXP for this entry
      const totalExp = newEntry.activities.reduce((sum, activity) => sum + activity.expValue, 0);
      newEntry.expGained = totalExp;
      
      // Save the journal entry
      await newEntry.save();
      
      // Calculate EXP for the user
      const categoryExp: Record<ActivityCategory, number> = {
        financial: 0,
        habits: 0,
        knowledge: 0,
        skills: 0,
        experiences: 0,
        network: 0
      };
      
      // Calculate EXP by category
      newEntry.activities.forEach(activity => {
        categoryExp[activity.category] += activity.expValue;
      });
      
      // Get current level before updating
      const oldLevel = expService.calculateLevel(user.totalExp);
      
      // Update user's total EXP and category stats
      user.totalExp += totalExp;
      
      // Update each category stat
      Object.keys(categoryExp).forEach(category => {
        const key = category as ActivityCategory;
        user.stats[key] += categoryExp[key];
      });
      
      // Save the updated user
      await user.save();
      
      // Calculate new level after update
      const newLevel = expService.calculateLevel(user.totalExp);
      const levelUp = newLevel > oldLevel;
      
      // Create EXP history record
      const expHistory = new ExpHistory({
        userId: user.id,
        date: new Date(),
        totalExp,
        levelUp,
        newLevel: levelUp ? newLevel : undefined,
        activities: newEntry.activities.map(activity => ({
          action: activity.action,
          category: activity.category,
          expValue: activity.expValue
        })),
        categoryExp
      });
      
      await expHistory.save();
      
      return newEntry;
    } catch (error) {
      logger.error('Error creating journal entry:', error);
      throw error;
    }
  },
  
  /**
   * Get journal entries for a user
   */
  async getUserEntries(clerkUserId: string, limit = 10, offset = 0): Promise<IJournalEntry[]> {
    try {
      const user = await User.findOne({ clerkId: clerkUserId });
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      const entries = await JournalEntry.find({ userId: user.id })
        .sort({ date: -1 })
        .skip(offset)
        .limit(limit);
      
      return entries;
    } catch (error) {
      logger.error('Error getting user journal entries:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific journal entry
   */
  async getEntry(id: string, clerkUserId: string): Promise<IJournalEntry | null> {
    try {
      const user = await User.findOne({ clerkId: clerkUserId });
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      const entry = await JournalEntry.findOne({
        _id: id,
        userId: user.id
      });
      
      return entry;
    } catch (error) {
      logger.error('Error getting journal entry:', error);
      throw error;
    }
  }
};