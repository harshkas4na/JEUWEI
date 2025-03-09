// src/services/exp.service.ts
import { User } from '../models/user.model';
import { ExpHistory } from '../models/exp.model';
import { JournalEntry, IJournalEntry, IActivity } from '../models/journal.model';
import { AppError } from '../middlewares/error.middleware';
import { logger } from '../utils/logger.util';
import { ActivityCategory } from '../types';

export const expService = {
  /**
   * Calculate level based on total EXP
   * Formula: Level N requires (N^2 × 50) EXP
   */
  calculateLevel(totalExp: number): number {
    if (totalExp < 50) return 1;
    
    let level = 1;
    while (this.calculateRequiredExp(level + 1) <= totalExp) {
      level++;
    }
    
    return level;
  },
  
  /**
   * Calculate required EXP for a given level
   */
  calculateRequiredExp(level: number): number {
    return Math.floor(Math.pow(level, 2) * 50);
  },
  
  /**
   * Get user's current EXP stats
   */
  async getUserExpStats(clerkUserId: string): Promise<{
    level: number;
    totalExp: number;
    nextLevelExp: number;
    progress: number;
    stats: Record<ActivityCategory, number>;
    recentActivities: any[];
  }> {
    try {
      // Get user from database
      const user = await User.findOne({ clerkId: clerkUserId });
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      const totalExp = user.totalExp;
      const level = this.calculateLevel(totalExp);
      const nextLevelExp = this.calculateRequiredExp(level + 1);
      const currentLevelExp = this.calculateRequiredExp(level);
      
      // Calculate progress percentage to next level
      const progress = ((totalExp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
      
      // Get recent journal entries for this user
      const recentEntries = await JournalEntry.find({ userId: user.id })
        .sort({ date: -1 })
        .limit(10) as IJournalEntry[];
      
      // Extract activities from recent journal entries
      const recentActivities = [];
      for (const entry of recentEntries) {
        for (const activity of entry.activities) {
          if(activity._id)
            if(entry._id)
          recentActivities.push({
            id: activity._id.toString(),
            journalId: entry._id.toString(),
            action: activity.action,
            category: activity.category,
            expValue: activity.expValue,
            date: activity.date
          });
        }
      }
      
      // Sort by date, newest first
      recentActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
      
      // Limit to 10 activities
      const limitedActivities = recentActivities.slice(0, 10);
      
      return {
        level,
        totalExp,
        nextLevelExp,
        progress,
        stats: user.stats,
        recentActivities: limitedActivities
      };
    } catch (error) {
      logger.error('Error getting user EXP stats:', error);
      throw error;
    }
  },
  
  /**
   * Get user's recent activities
   */
  async getRecentActivities(clerkUserId: string, limit = 10): Promise<any[]> {
    try {
      // Get user from database
      const user = await User.findOne({ clerkId: clerkUserId });
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      // Get recent journal entries for this user
      const recentEntries = await JournalEntry.find({ userId: user.id })
        .sort({ date: -1 })
        .limit(20); // Fetch more to ensure we have enough activities
      
      // Extract activities from recent journal entries
      const recentActivities = [];
      for (const entry of recentEntries) {
        for (const activity of entry.activities) {
          if (activity._id) {
            if(entry._id)
            recentActivities.push({
              id: activity._id.toString(),
              journalId: entry._id.toString(),
              action: activity.action,
              category: activity.category,
              expValue: activity.expValue,
              date: activity.date
            });
          }
        }
      }
      
      // Sort by date, newest first
      recentActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
      
      // Limit to requested number of activities
      return recentActivities.slice(0, limit);
    } catch (error) {
      logger.error('Error getting recent activities:', error);
      throw error;
    }
  },
  
  /**
   * Get EXP history for a user
   */
  async getExpHistory(clerkUserId: string, limit = 30, offset = 0): Promise<any[]> {
    try {
      // Get user from database
      const user = await User.findOne({ clerkId: clerkUserId });
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      // Get EXP history for this user
      const history = await ExpHistory.find({ userId: user.id })
        .sort({ date: -1 })
        .skip(offset)
        .limit(limit);
      
      return history;
    } catch (error) {
      logger.error('Error getting EXP history:', error);
      throw error;
    }
  }
};