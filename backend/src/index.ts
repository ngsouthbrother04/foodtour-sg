import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { loadAllData } from './services/csvLoader';
import { apiRoutes, adminController } from './routes';
import { errorHandler, notFoundHandler, requestLogger } from './middlewares';
import logger from './utils/logger';

function createApp() {
  const app = express();

  app.use(helmet());

  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Quá nhiều request, vui lòng thử lại sau' },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
  }));

  app.use(express.json());
  app.use(requestLogger);
  app.get('/health', adminController.healthCheck);
  app.use('/api/v1', apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

function startServer() {
  logger.info('🚀 Starting Food Tour SG API...');
  loadAllData(config.dataDir);

  const app = createApp();
  
  app.listen(config.port, () => {
    logger.info(`🍜 Server running at http://localhost:${config.port}`);
    logger.info(`📖 API docs: http://localhost:${config.port}/api/v1/restaurants`);
    logger.info(`🔧 Environment: ${config.nodeEnv}`);
  });
}

// Start server
startServer();
