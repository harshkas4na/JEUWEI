// src/app.ts
import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Initialize Clerk
import { clerkClient } from '@clerk/express';

// Import database connection
import connectDB from './config/database';

// Import routes
import journalRoutes from './routes/journal.routes';
import statsRoutes from './routes/stats.routes';
import userRoutes from './routes/user.routes';

// Import middleware
import { errorHandler } from './middlewares/error.middleware';
import { clerkAuthMiddleware } from './middlewares/auth.middleware';
import { logger } from './utils/logger.util';

// Check for Clerk secret key
if (!process.env.CLERK_SECRET_KEY) {
  logger.error('Missing CLERK_SECRET_KEY environment variable');
  process.exit(1);
}

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '8000', 10);

// Connect to MongoDB
connectDB().catch(err => {
  logger.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());

// Apply Clerk middleware to all routes
app.use(clerkAuthMiddleware);

// Routes
app.use('/api/journal', journalRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/user', userRoutes);

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Jeuwei API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;