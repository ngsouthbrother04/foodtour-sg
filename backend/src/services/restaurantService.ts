import { Restaurant, FilterOptions } from '../types/restaurant';
import { SortField, SortOrder } from '../types/enums';
import { getRestaurants } from './csvLoader';
import { isPriceInRange } from '../utils/priceParser';

interface SearchParams {
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

interface SearchResult {
  restaurants: Restaurant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function searchRestaurants(params: SearchParams): SearchResult {
  const {
    q,
    district,
    category,
    minPrice,
    maxPrice,
    page = 1,
    limit = 20,
    sort = SortField.NAME,
    order = SortOrder.ASC,
  } = params;

  let results = getRestaurants();

  if (q) {
    const searchTerms = q.toLowerCase().split(/\s+/);
    results = results.filter(r => {
      const searchText = `${r.name} ${r.dish} ${r.address} ${r.note || ''} ${r.review || ''}`.toLowerCase();
      return searchTerms.every(term => searchText.includes(term));
    });
  }

  if (district) {
    results = results.filter(r => 
      r.district.toLowerCase() === district.toLowerCase()
    );
  }

  if (category) {
    results = results.filter(r => 
      r.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    results = results.filter(r => 
      isPriceInRange(r.priceRange, minPrice, maxPrice)
    );
  }

  results.sort((a, b) => {
    let comparison = 0;
    
    switch (sort) {
      case SortField.NAME:
        comparison = a.name.localeCompare(b.name, 'vi');
        break;
      case SortField.PRICE:
        const priceA = a.priceRange.min ?? a.priceRange.max ?? 0;
        const priceB = b.priceRange.min ?? b.priceRange.max ?? 0;
        comparison = priceA - priceB;
        break;
      case SortField.DISTRICT:
        comparison = a.district.localeCompare(b.district, 'vi');
        break;
    }
    
    return order === SortOrder.DESC ? -comparison : comparison;
  });

  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);

  return {
    restaurants: paginatedResults,
    total,
    page,
    limit,
    totalPages,
  };
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return getRestaurants().find(r => r.id === id);
}

export function getRandomRestaurant(): Restaurant | undefined {
  const restaurants = getRestaurants();
  if (restaurants.length === 0) return undefined;
  
  const randomIndex = Math.floor(Math.random() * restaurants.length);
  return restaurants[randomIndex];
}

export function getFilterOptions(): FilterOptions {
  const restaurants = getRestaurants();
  
  const districts = [...new Set(restaurants.map(r => r.district))].sort((a, b) => 
    a.localeCompare(b, 'vi')
  );
  
  const categories = [...new Set(restaurants.map(r => r.category))].sort((a, b) => 
    a.localeCompare(b, 'vi')
  );

  return {
    districts,
    categories,
    priceRanges: ['< 30k', '30k - 50k', '50k - 100k', '> 100k'],
  };
}

export function getSimilarRestaurants(id: string, limit = 5): Restaurant[] {
  const restaurant = getRestaurantById(id);
  if (!restaurant) return [];

  return getRestaurants()
    .filter(r => 
      r.id !== id && 
      (r.category === restaurant.category || r.district === restaurant.district)
    )
    .slice(0, limit);
}
