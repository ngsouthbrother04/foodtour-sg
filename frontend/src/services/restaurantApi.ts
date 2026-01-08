import apiClient from './apiClient';
import { Restaurant, APIResponse, FilterOptions, SearchParams } from '../types';

export async function searchRestaurants(params: SearchParams): Promise<APIResponse<Restaurant[]>> {
  const { data } = await apiClient.get<APIResponse<Restaurant[]>>('/restaurants', { params });
  return data;
}

export async function getRestaurantById(id: string): Promise<APIResponse<Restaurant>> {
  const { data } = await apiClient.get<APIResponse<Restaurant>>(`/restaurants/${id}`);
  return data;
}

export async function getRandomRestaurant(): Promise<APIResponse<Restaurant>> {
  const { data } = await apiClient.get<APIResponse<Restaurant>>('/restaurants/random');
  return data;
}

export async function getFilterOptions(): Promise<APIResponse<FilterOptions>> {
  const { data } = await apiClient.get<APIResponse<FilterOptions>>('/restaurants/filters');
  return data;
}

export async function getSimilarRestaurants(id: string, limit = 5): Promise<APIResponse<Restaurant[]>> {
  const { data } = await apiClient.get<APIResponse<Restaurant[]>>(`/restaurants/${id}/similar`, {
    params: { limit },
  });
  return data;
}
