import { Router } from 'express';

const router = Router();

// User routes will be implemented with Clerk authentication
router.get('/profile', (_req, res) => {
  res.json({ message: 'User profile route (to be implemented with Clerk)' });
});

export default router;