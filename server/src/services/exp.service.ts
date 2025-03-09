// src/services/exp.service.ts
import { Activity, ActivityCategory } from '../types';
import { dataStore } from './data.service';

export const expService = {
  /**
   * Calculate EXP for activities
   */
  async calculateExp(userId: string, activities: Activity[]): Promise<{
    totalExp: number;
    categoryExp: Record<ActivityCategory, number>;
    levelUp: boolean;
    newLevel: number;
  }> {
    // Get current user stats
    const userStats = dataStore.getUserStats(userId);
    
    // Calculate EXP by category
    const categoryExp: Record<ActivityCategory, number> = {
      financial: 0,
      habits: 0,
      knowledge: 0,
      skills: 0,
      experiences: 0,
      network: 0
    };
    
    // Sum up EXP values by category
    activities.forEach(activity => {
      categoryExp[activity.category] += activity.expValue;
    });
    
    // Calculate total EXP gained
    const totalExp = Object.values(categoryExp).reduce((sum, exp) => sum + exp, 0);
    
    // Calculate level before
    const oldLevel = this.calculateLevel(userStats.totalExp);
    
    // Update user stats
    dataStore.updateUserStats(userId, totalExp, categoryExp);
    
    // Get updated user stats
    const updatedStats = dataStore.getUserStats(userId);
    
    // Calculate new level
    const newLevel = this.calculateLevel(updatedStats.totalExp);
    
    // Check if user leveled up
    const levelUp = newLevel > oldLevel;
    
    return {
      totalExp,
      categoryExp,
      levelUp,
      newLevel
    };
  },
  
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
  async getUserExpStats(userId: string): Promise<{
    level: number;
    totalExp: number;
    nextLevelExp: number;
    progress: number;
    stats: Record<ActivityCategory, number>;
    recentActivities: Activity[];
  }> {
    const userStats = dataStore.getUserStats(userId);
    const totalExp = userStats.totalExp;
    const level = this.calculateLevel(totalExp);
    const nextLevelExp = this.calculateRequiredExp(level + 1);
    const currentLevelExp = this.calculateRequiredExp(level);
    
    // Calculate progress percentage to next level
    const progress = ((totalExp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
    
    // Get recent activities
    const recentActivities = dataStore.getRecentActivities(userId, 10);
    
    return {
      level,
      totalExp,
      nextLevelExp,
      progress,
      stats: userStats.stats,
      recentActivities
    };
  }
};