// src/controllers/journal.controller.ts
import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { journalService } from '../services/journal.service';
import { sendSuccess } from '../utils/response.util';
import { AppError } from '../middlewares/error.middleware';
import { logger } from '../utils/logger.util';

export const journalController = {
  /**
   * Create a new journal entry
   */
  async createEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const { content } = req.body;
      const auth = getAuth(req);
      
      if (!content) {
        throw new AppError('Journal content is required', 400);
      }
      
      if (!auth.userId) {
        throw new AppError('User not authenticated', 401);
      }
      
      const newEntry = await journalService.createEntry(auth.userId, content);
      
      // Format response to match frontend expectations
      const formattedEntry = {
        id: newEntry._id,
        userId: newEntry.userId,
        content: newEntry.content,
        processedContent: newEntry.processedContent,
        date: newEntry.date,
        expGained: newEntry.expGained,
        activities: newEntry.activities.map(activity => ({
          id: activity._id,
          action: activity.action,
          category: activity.category,
          expValue: activity.expValue,
          date: activity.date
        })),
        createdAt: newEntry.createdAt,
        updatedAt: newEntry.updatedAt
      };
      
      return sendSuccess(res, formattedEntry, 'Journal entry created successfully', 201);
    } catch (error) {
      logger.error('Error in createEntry controller:', error);
      next(error);
    }
  },
  
  /**
   * Get journal entries for the current user
   */
  async getUserEntries(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      
      if (!auth.userId) {
        throw new AppError('User not authenticated', 401);
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      
      const entries = await journalService.getUserEntries(auth.userId, limit, offset);
      
      // Format response to match frontend expectations
      const formattedEntries = entries.map(entry => ({
        id: entry._id,
        userId: entry.userId,
        content: entry.content,
        processedContent: entry.processedContent,
        date: entry.date,
        expGained: entry.expGained,
        activities: entry.activities.map(activity => ({
          id: activity._id,
          action: activity.action,
          category: activity.category,
          expValue: activity.expValue,
          date: activity.date
        })),
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      }));
      
      return sendSuccess(res, formattedEntries, 'Journal entries retrieved successfully');
    } catch (error) {
      logger.error('Error in getUserEntries controller:', error);
      next(error);
    }
  },
  
  /**
   * Get a specific journal entry
   */
  async getEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const auth = getAuth(req);
      
      if (!auth.userId) {
        throw new AppError('User not authenticated', 401);
      }
      
      const entry = await journalService.getEntry(id, auth.userId);
      
      if (!entry) {
        throw new AppError('Journal entry not found', 404);
      }
      
      // Format response to match frontend expectations
      const formattedEntry = {
        id: entry._id,
        userId: entry.userId,
        content: entry.content,
        processedContent: entry.processedContent,
        date: entry.date,
        expGained: entry.expGained,
        activities: entry.activities.map(activity => ({
          id: activity._id,
          action: activity.action,
          category: activity.category,
          expValue: activity.expValue,
          date: activity.date
        })),
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      };
      
      return sendSuccess(res, formattedEntry, 'Journal entry retrieved successfully');
    } catch (error) {
      logger.error('Error in getEntry controller:', error);
      next(error);
    }
  }
};