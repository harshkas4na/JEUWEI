// src/controllers/stats.controller.ts
import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { expService } from '../services/exp.service';
import { dataStore } from '../services/data.service'; // Fixed import path
import { sendSuccess } from '../utils/response.util';
import { AppError } from '../middlewares/error.middleware';

export const statsController = {
  /**
   * Get user's EXP stats
   */
  async getExpStats(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      
      if (!auth.userId) {
        throw new AppError('User not authenticated', 401);
      }
      
      const stats = await expService.getUserExpStats(auth.userId);
      
      return sendSuccess(res, stats, 'User EXP stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get recent activities
   */
  async getRecentActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req); // Using getAuth instead of req.auth
      
      if (!auth.userId) {
        throw new AppError('User not authenticated', 401);
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      
      const activities = dataStore.getRecentActivities(auth.userId, limit);
      
      return sendSuccess(res, activities, 'Recent activities retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
};