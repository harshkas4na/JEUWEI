// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/response.util';
import { AppError } from '../middlewares/error.middleware';
import { logger } from '../utils/logger.util';

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
      
      // Get user profile from service
      const userProfile = await userService.getUserProfile(auth.userId);
      
      return sendSuccess(res, userProfile, 'User profile retrieved successfully');
    } catch (error) {
      logger.error('Error in getProfile controller:', error);
      next(error);
    }
  },
  
  /**
   * Create or update user
   * This can be called when a user first logs in
   */
  async createOrUpdateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      
      if (!auth.userId) {
        throw new AppError('User not authenticated', 401);
      }
      
      // Get or create user
      const user = await userService.getOrCreateUser(auth.userId);
      
      // Return user profile
      const userProfile = await userService.getUserProfile(auth.userId);
      
      return sendSuccess(res, userProfile, 'User created or updated successfully');
    } catch (error) {
      logger.error('Error in createOrUpdateUser controller:', error);
      next(error);
    }
  },
  
  /**
   * Update user profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      
      if (!auth.userId) {
        throw new AppError('User not authenticated', 401);
      }
      
      const { username, firstName, lastName } = req.body;
      
      // Update user
      await userService.updateUser(auth.userId, {
        username,
        firstName,
        lastName
      });
      
      // Return updated user profile
      const userProfile = await userService.getUserProfile(auth.userId);
      
      return sendSuccess(res, userProfile, 'User profile updated successfully');
    } catch (error) {
      logger.error('Error in updateProfile controller:', error);
      next(error);
    }
  }
};