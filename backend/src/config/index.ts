import path from 'path';

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  dataDir: process.env.CSV_DATA_PATH || path.join(__dirname, '../../../data'),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  logLevel: process.env.LOG_LEVEL || 'info',
} as const;

export type Config = typeof config;
