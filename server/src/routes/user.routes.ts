// src/routes/user.routes.ts
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { requireAuthentication } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes
router.use(requireAuthentication);

// Get user profile
router.get('/profile', userController.getProfile);

// Create or update user
router.post('/init', userController.createOrUpdateUser);

// Update user profile
router.put('/profile', userController.updateProfile);

export default router;