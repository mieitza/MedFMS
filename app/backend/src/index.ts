import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { initDatabase } from './db/index.js';
import router from './routes/index.js';
import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.SERVER_PORT || 3000;
const HOST = process.env.SERVER_HOST || 'localhost';

// Trust proxy when behind nginx/reverse proxy
// This is needed for rate limiting and proper IP detection
// Trust only loopback (localhost) - nginx is on the same machine
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 'loopback');
}

// Initialize database
await initDatabase();

// CORS configuration - allow all in development for Next.js migration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Request processing middleware
app.use(compression());

// Skip body parsing for upload routes entirely
app.use((req, res, next) => {
  if (req.url.includes('/api/documents/photos/upload') || req.url.includes('/api/documents/upload') || req.url.includes('/anmdm-document')) {
    return next();
  }
  express.json({ limit: '10mb' })(req, res, next);
});

app.use((req, res, next) => {
  if (req.url.includes('/api/documents/photos/upload') || req.url.includes('/api/documents/upload') || req.url.includes('/anmdm-document')) {
    return next();
  }
  express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
});

// Logging
app.use(requestLogger);

// Rate limiting
app.use('/api/', rateLimiter);

// Static files for uploads
app.use('/uploads', express.static(join(__dirname, '../../../uploads')));

// Auth routes mounted directly for legacy support
app.use('/', authRoutes);

// API routes
app.use('/api', router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// NOTE: Frontend is served by a separate medfms-frontend PM2 process on port 5173
// Nginx routes frontend requests to that port and API requests to this backend (port 3000)
// The following code is commented out to prevent the backend from serving frontend files
//
// // Serve SvelteKit frontend in production
// if (process.env.NODE_ENV === 'production') {
//   const frontendPath = join(__dirname, '../../frontend/build');
//   app.use(express.static(frontendPath));
//   app.get('*', (req, res) => {
//     res.sendFile(join(frontendPath, 'index.html'));
//   });
// }

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on http://${HOST}:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === 'development') {
    logger.info(`API Documentation: http://${HOST}:${PORT}/api/docs`);
  }
});
