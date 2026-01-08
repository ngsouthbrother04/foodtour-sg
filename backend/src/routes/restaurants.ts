import { Router } from 'express';
import { restaurantController } from '../controllers';
import { validateRequest } from '../middlewares';
import { searchParamsSchema, restaurantIdSchema, limitSchema } from '../utils/validation';
import { z } from 'zod';

const router = Router();

const idParamsSchema = z.object({
  id: restaurantIdSchema,
});

const similarQuerySchema = z.object({
  limit: limitSchema,
});

router.get(
  '/',
  validateRequest(searchParamsSchema, 'query'),
  restaurantController.search
);

router.get('/random', restaurantController.getRandom);

router.get('/filters', restaurantController.getFilters);

router.get(
  '/:id',
  validateRequest(idParamsSchema, 'params'),
  restaurantController.getById
);

router.get(
  '/:id/similar',
  validateRequest(idParamsSchema, 'params'),
  validateRequest(similarQuerySchema, 'query'),
  restaurantController.getSimilar
);

export default router;
