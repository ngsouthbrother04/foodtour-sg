import { DataSource, SortField, SortOrder } from './enums';

export interface Restaurant {
  id: string;
  name: string;
  dish: string;
  category: string;
  address: string;
  district: string;
  openingHours: string | null;
  priceRange: {
    min: number | null;
    max: number | null;
    display: string;
  };
  note: string | null;
  review: string | null;
  feedback: string | null;
  source: DataSource;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface FilterOptions {
  districts: string[];
  categories: string[];
  priceRanges: string[];
}

export interface SearchParams {
  q?: string;
  district?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: SortField;
  order?: SortOrder;
}
