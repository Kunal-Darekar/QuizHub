import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';
import generatorRoutes from './routes/generator.js';

// Load environment variables
config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/generate-questions', generatorRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

export default app;