// src/routes/stats.routes.ts
import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';
import { requireAuthentication } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes
router.use(requireAuthentication);

// Get user's EXP stats
router.get('/exp', statsController.getExpStats);

// Get recent activities
router.get('/activities', statsController.getRecentActivities);

// Get EXP history
router.get('/history', statsController.getExpHistory);

export default router;