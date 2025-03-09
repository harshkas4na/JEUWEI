// src/routes/journal.routes.ts
import { Router } from 'express';
import { journalController } from '../controllers/journal.controller';
import { requireAuthentication } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes
router.use(requireAuthentication);

// Create a new journal entry
router.post('/', journalController.createEntry);

// Get user's journal entries
router.get('/', journalController.getUserEntries);

// Get a specific journal entry
router.get('/:id', journalController.getEntry);

export default router;