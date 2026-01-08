import { z } from 'zod';
import { SORT_FIELDS, SORT_ORDERS, SortField, SortOrder } from '../types/enums';

export const searchParamsSchema = z.object({
  q: z.string().max(200).optional(),
  district: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  minPrice: z.coerce.number().min(0).max(10000000).optional(),
  maxPrice: z.coerce.number().min(0).max(10000000).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(SORT_FIELDS).default(SortField.NAME),
  order: z.enum(SORT_ORDERS).default(SortOrder.ASC),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

export function validateSearchParams(query: unknown): SearchParams {
  return searchParamsSchema.parse(query);
}

export const restaurantIdSchema = z.string().min(1).max(200);

export const limitSchema = z.coerce.number().int().min(1).max(20).default(5);
