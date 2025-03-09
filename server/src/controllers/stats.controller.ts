// src/controllers/stats.controller.ts
import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { expService } from '../services/exp.service';
import { sendSuccess } from '../utils/response.util';
import { AppError } from '../middlewares/error.middleware';
import { logger } from '../utils/logger.util';

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
      logger.error('Error in getExpStats controller:', error);
      next(error);
    }
  },
  
  /**
   * Get recent activities
   */
  async getRecentActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      
      if (!auth.userId) {
        throw new AppError('User not authenticated', 401);
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      
      const activities = await expService.getRecentActivities(auth.userId, limit);
      
      return sendSuccess(res, activities, 'Recent activities retrieved successfully');
    } catch (error) {
      logger.error('Error in getRecentActivities controller:', error);
      next(error);
    }
  },
  
  /**
   * Get EXP history
   */
  async getExpHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      
      if (!auth.userId) {
        throw new AppError('User not authenticated', 401);
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 30;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      
      const history = await expService.getExpHistory(auth.userId, limit, offset);
      
      return sendSuccess(res, history, 'EXP history retrieved successfully');
    } catch (error) {
      logger.error('Error in getExpHistory controller:', error);
      next(error);
    }
  }
};