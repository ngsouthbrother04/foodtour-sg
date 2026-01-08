import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  searchRestaurants,
  getRestaurantById,
  getRandomRestaurant,
  getFilterOptions,
  getSimilarRestaurants,
} from '../services/restaurantApi';
import { SearchParams } from '../types';

export const restaurantKeys = {
  all: ['restaurants'] as const,
  lists: () => [...restaurantKeys.all, 'list'] as const,
  list: (params: SearchParams) => [...restaurantKeys.lists(), params] as const,
  details: () => [...restaurantKeys.all, 'detail'] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
  similar: (id: string) => [...restaurantKeys.detail(id), 'similar'] as const,
  random: () => [...restaurantKeys.all, 'random'] as const,
  filters: () => [...restaurantKeys.all, 'filters'] as const,
};

export function useRestaurants(params: SearchParams) {
  return useQuery({
    queryKey: restaurantKeys.list(params),
    queryFn: () => searchRestaurants(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useInfiniteRestaurants(params: Omit<SearchParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: restaurantKeys.list(params),
    queryFn: ({ pageParam = 1 }) => searchRestaurants({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: restaurantKeys.detail(id),
    queryFn: () => getRestaurantById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useRandomRestaurant() {
  return useQuery({
    queryKey: restaurantKeys.random(),
    queryFn: getRandomRestaurant,
    enabled: false, // Manual trigger only
    staleTime: 0, // Always fresh
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: restaurantKeys.filters(),
    queryFn: getFilterOptions,
    staleTime: 30 * 60 * 1000, // 30 minutes - filters don't change often
  });
}

/**
 * Hook to get similar restaurants
 */
export function useSimilarRestaurants(id: string, limit = 5) {
  return useQuery({
    queryKey: restaurantKeys.similar(id),
    queryFn: () => getSimilarRestaurants(id, limit),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
