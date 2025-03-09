// src/middlewares/auth.middleware.ts
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { clerkClient } from '@clerk/express';


// Define a custom interface to extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        firstName?: string;
        lastName?: string;
      };
    }
  }
}

// Clerk middleware to process authentication on all requests
export const clerkAuthMiddleware = clerkMiddleware();

// Middleware to require authentication
export const requireAuthentication = requireAuth();

// Middleware to load user data
export const loadUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req);
    
    if (!auth.userId) {
      return next();
    }

    // Get user data from Clerk
    const user = await clerkClient.users.getUser(auth.userId);
    
    // Add user data to request object
    req.user = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || user.firstName || 'User'
    };
    
    next();
  } catch (error) {
    next(new AppError('Error loading user data', 500));
  }
};

// Combined authentication middleware
export const authenticate = [requireAuthentication, loadUser];