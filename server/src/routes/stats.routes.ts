// src/routes/stats.routes.ts
import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes
router.use(authenticate);

// Get user's EXP stats
router.get('/exp', statsController.getExpStats);

// Get recent activities
router.get('/activities', statsController.getRecentActivities);

export default router;