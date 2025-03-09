// src/services/user.service.ts
import { User, IUser } from '../models/user.model';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { logger } from '../utils/logger.util';
import { AppError } from '../middlewares/error.middleware';

export const userService = {
  /**
   * Get or create a user from Clerk ID
   */
  async getOrCreateUser(clerkId: string): Promise<IUser> {
    try {
      // Check if user already exists in our database
      let user = await User.findOne({ clerkId });
      
      if (!user) {
        // User doesn't exist yet, fetch from Clerk and create
        const clerkUser = await clerkClient.users.getUser(clerkId);
        
        if (!clerkUser) {
          throw new AppError('User not found in Clerk', 404);
        }
        
        // Create new user in our database
        user = new User({
          clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          username: clerkUser.username || clerkUser.firstName || 'User',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          totalExp: 0,
          stats: {
            financial: 0,
            habits: 0,
            knowledge: 0,
            skills: 0,
            experiences: 0,
            network: 0
          }
        });
        
        await user.save();
        logger.info(`Created new user with Clerk ID: ${clerkId}`);
      }
      
      return user;
    } catch (error) {
      logger.error('Error getting or creating user:', error);
      throw error;
    }
  },
  
  /**
   * Get user profile combined with Clerk data
   */
  async getUserProfile(clerkId: string): Promise<any> {
    try {
      // Get user from our database
      const user = await this.getOrCreateUser(clerkId);
      
      // Get latest Clerk user data
      const clerkUser = await clerkClient.users.getUser(clerkId);
      
      // Calculate level information using the user's totalExp
      const level = Math.floor(Math.sqrt(user.totalExp / 50)) + 1;
      const nextLevelExp = Math.pow(level, 2) * 50;
      const currentLevelExp = Math.pow(level - 1, 2) * 50;
      const progress = ((user.totalExp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
      
      return {
        id: user._id,
        clerkId: user.clerkId,
        email: clerkUser.emailAddresses[0]?.emailAddress || user.email,
        username: clerkUser.username || clerkUser.firstName || user.username,
        firstName: clerkUser.firstName || user.firstName,
        lastName: clerkUser.lastName || user.lastName,
        imageUrl: clerkUser.imageUrl,
        totalExp: user.totalExp,
        level,
        nextLevelExp,
        progress,
        stats: user.stats
      };
    } catch (error) {
      logger.error('Error getting user profile:', error);
      throw error;
    }
  },
  
  /**
   * Update user data
   */
  async updateUser(clerkId: string, userData: Partial<IUser>): Promise<IUser> {
    try {
      // Get user from our database
      const user = await User.findOne({ clerkId });
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      // Update allowed fields
      if (userData.username) user.username = userData.username;
      if (userData.firstName) user.firstName = userData.firstName;
      if (userData.lastName) user.lastName = userData.lastName;
      
      await user.save();
      
      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }
};