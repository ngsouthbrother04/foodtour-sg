import { Request, Response, NextFunction } from 'express';
import { reloadData } from '../services/csvLoader';
import { config } from '../config';
import logger from '../utils/logger';

export const adminController = {
  reloadData(_req: Request, res: Response, next: NextFunction): void {
    try {
      const restaurants = reloadData(config.dataDir);
      logger.info(`Data reloaded: ${restaurants.length} restaurants`);
      
      res.json({ 
        success: true, 
        message: `Reloaded ${restaurants.length} restaurants` 
      });
    } catch (error) {
      next(error);
    }
  },

  healthCheck(_req: Request, res: Response): void {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    });
  },
};
