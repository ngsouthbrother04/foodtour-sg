// Enum cho sort field
export enum SortField {
  NAME = 'name',
  PRICE = 'price',
  DISTRICT = 'district',
}

// Enum cho sort order
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// Enum cho nguồn dữ liệu CSV
export enum DataSource {
  FOODTOUR = 'foodtour',
  SAIGON_EVERYFOOD = 'saigon_everyfood',
}

// Enum cho error code
export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// Helper để lấy values của enum dưới dạng array (dùng cho Zod)
export const SORT_FIELDS = Object.values(SortField) as [SortField, ...SortField[]];
export const SORT_ORDERS = Object.values(SortOrder) as [SortOrder, ...SortOrder[]];
export const DATA_SOURCES = Object.values(DataSource) as [DataSource, ...DataSource[]];
