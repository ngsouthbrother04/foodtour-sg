import { Request, Response, NextFunction } from 'express';
import { 
  searchRestaurants, 
  getRestaurantById, 
  getRandomRestaurant,
  getFilterOptions,
  getSimilarRestaurants 
} from '../services/restaurantService';
import { APIResponse, Restaurant, FilterOptions } from '../types/restaurant';
import { SortField, SortOrder } from '../types/enums';
import { NotFoundError } from '../middlewares/errorHandler';

export const restaurantController = {
  search(req: Request, res: Response, next: NextFunction): void {
    try {
      const { q, district, category, minPrice, maxPrice, page, limit, sort, order } = req.query as {
        q?: string;
        district?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        page?: number;
        limit?: number;
        sort?: SortField;
        order?: SortOrder;
      };

      const result = searchRestaurants({
        q,
        district,
        category,
        minPrice,
        maxPrice,
        page,
        limit,
        sort,
        order,
      });

      const response: APIResponse<Restaurant[]> = {
        success: true,
        data: result.restaurants,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  },

  getRandom(_req: Request, res: Response, next: NextFunction): void {
    try {
      const restaurant = getRandomRestaurant();
      
      if (!restaurant) {
        throw new NotFoundError('Không tìm thấy quán ăn');
      }

      const response: APIResponse<Restaurant> = {
        success: true,
        data: restaurant,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  },

  getFilters(_req: Request, res: Response, next: NextFunction): void {
    try {
      const filters = getFilterOptions();
      
      const response: APIResponse<FilterOptions> = {
        success: true,
        data: filters,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  },

  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const restaurant = getRestaurantById(id);
      
      if (!restaurant) {
        throw new NotFoundError('Không tìm thấy quán ăn');
      }

      const response: APIResponse<Restaurant> = {
        success: true,
        data: restaurant,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  },

  getSimilar(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const limit = req.query.limit as number | undefined;
      
      const similar = getSimilarRestaurants(id, limit);

      const response: APIResponse<Restaurant[]> = {
        success: true,
        data: similar,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
};
