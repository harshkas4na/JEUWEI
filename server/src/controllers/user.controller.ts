// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { getAuth, clerkClient } from '@clerk/express';
import { sendSuccess } from '../utils/response.util';
import { AppError } from '../middlewares/error.middleware';
import { expService } from '../services/exp.service';

export const userController = {
  /**
   * Get user profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      
      if (!auth.userId) {
        throw new AppError('User not authenticated', 401);
      }
      
      // Fetch user from Clerk
      const user = await clerkClient.users.getUser(auth.userId);
      
      // Get EXP stats
      const stats = await expService.getUserExpStats(auth.userId);
      
      const userProfile = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username || user.firstName || 'User',
        imageUrl: user.imageUrl,
        level: stats.level,
        totalExp: stats.totalExp,
        progress: stats.progress,
        nextLevelExp: stats.nextLevelExp
      };
      
      return sendSuccess(res, userProfile, 'User profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
};