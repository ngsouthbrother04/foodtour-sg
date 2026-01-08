# Food Recommendation App

## Overview

Food Recommendation App là một ứng dụng web giúp người dùng khám phá và chọn lựa các món ăn, quán ăn được cộng đồng đề xuất tại TP. Hồ Chí Minh (Sài Gòn). Ứng dụng tập trung vào việc cung cấp các gợi ý dựa trên dữ liệu từ cộng đồng, bao gồm thông tin về tên quán, món ăn, loại món, địa điểm (quận/huyện), giờ mở cửa, khoảng giá và các ghi chú bổ sung. Dữ liệu được lưu trữ dưới dạng file CSV, cho phép dễ dàng cập nhật và mở rộng từ các nguồn cộng đồng.

Mục đích chính của dự án là hỗ trợ người dùng tìm kiếm nhanh chóng các lựa chọn ăn uống phù hợp với sở thích, ngân sách và vị trí địa lý, đồng thời khuyến khích cộng đồng chia sẻ thêm các đề xuất để làm phong phú dữ liệu.

## Technologies

### Frontend
- **Framework**: React.js 18+ với TypeScript - Đảm bảo type safety và developer experience tốt hơn
- **Build Tool**: Vite - Thay thế Create React App (deprecated), build nhanh hơn và HMR tốt hơn
- **Routing**: React Router v6
- **State Management**: Zustand hoặc React Query (TanStack Query) - Lightweight và hiệu quả cho việc cache API calls
- **UI Components**: Ant Design 5.x - Chọn một UI library duy nhất để đảm bảo consistency
- **HTTP Client**: Axios với interceptors để xử lý errors và loading states
- **Styling**: TailwindCSS kết hợp Ant Design - Utility-first CSS cho customization nhanh

### Backend
- **Runtime**: Node.js 20 LTS với TypeScript
- **Framework**: Express.js với middleware pattern
- **CSV Processing**: 
  - `papaparse` - Parse CSV hiệu quả, hỗ trợ streaming và UTF-8 encoding tốt (quan trọng cho tiếng Việt)
  - Hoặc `fast-csv` cho datasets lớn
- **Caching**: Node-cache hoặc Redis (nếu cần scale) - Cache dữ liệu CSV để không phải đọc file mỗi request
- **Validation**: Zod hoặc Joi - Validate query parameters và request body
- **Security**: helmet, cors, express-rate-limit
- **Logging**: Winston hoặc Pino

### Deployment
- **Frontend**: Vercel (tối ưu cho React/Vite, có Edge Functions)

- **Backend**: Render

## Data Processing & Normalization

Do hai file CSV có schema khác nhau, cần thực hiện data normalization:

### Unified Schema

```typescript
interface Restaurant {
  id: string;                    // Generated unique ID
  name: string;                  // Tên quán
  dish: string;                  // Tên món
  category: string;              // Phân loại món (normalized)
  address: string;               // Địa chỉ đầy đủ
  district: string;              // Quận/Huyện (normalized: "Quận 1", "Quận Bình Thạnh",...)
  openingHours: string | null;   // Giờ mở cửa
  priceRange: {
    min: number | null;          // Giá thấp nhất (VND)
    max: number | null;          // Giá cao nhất (VND)
    display: string;             // Hiển thị gốc: "20k-25k", "<50k"
  };
  note: string | null;           // Ghi chú
  review: string | null;         // Review từ cộng đồng
  feedback: string | null;       // Feedback bổ sung
  source: 'foodtour' | 'saigon_everyfood';  // Nguồn dữ liệu
}
```

### Price Parsing Logic

Xử lý các format giá khác nhau:

- `"20k-25k"` → `{ min: 20000, max: 25000 }`
- `"<50k"` hoặc `"< 50k"` → `{ min: null, max: 50000 }`
- `">100k"` → `{ min: 100000, max: null }`
- `"45k"` → `{ min: 45000, max: 45000 }`
- `"Nhiều giá"` → `{ min: null, max: null }`
- `"280k-350k-450k"` → `{ min: 280000, max: 450000 }` (lấy range rộng nhất)

### District Normalization

Chuẩn hóa tên quận:
- `"1"` → `"Quận 1"`
- `"quận 1"` → `"Quận 1"`
- `"Q1"` → `"Quận 1"`
- `"Bình Thạnh"` → `"Quận Bình Thạnh"`

## Features

### Core Features

- **Tìm kiếm và Lọc**:
  - Full-text search cho tên quán, món ăn
  - Filter theo quận/huyện (dropdown với danh sách chuẩn hóa)
  - Filter theo loại món (Bánh mì, Cơm, Món nước, Ăn vặt, Lẩu, Cafe,...)
  - Filter theo khoảng giá (slider hoặc preset: <30k, 30k-50k, 50k-100k, >100k)
  - Filter theo giờ mở cửa (đang mở, sáng, trưa, tối, khuya)
  - Combine multiple filters với AND logic

- **Hiển thị Chi Tiết**:
  - Card view với lazy loading images (nếu có)
  - Thông tin đầy đủ: tên quán, địa chỉ, giá, review
  - Highlight matched search terms

- **Gợi Ý Thông Minh**:
  - "Quán tương tự" dựa trên category và district
  - Random suggestion cho user không biết ăn gì

### UX Improvements

- **Responsive Design**: Mobile-first approach
- **Skeleton Loading**: Hiển thị placeholder khi đang tải
- **Debounced Search**: Tránh spam API khi user typing
- **URL Persistence**: Lưu filter state vào URL để có thể share link
- **Offline Support**: Service Worker cache static assets và data

### Optional Integrations

- **Google Maps/OpenStreetMap**: Hiển thị vị trí với Leaflet.js (miễn phí, không cần API key)
- **Share**: Copy link với filters đã chọn

## API Design

### RESTful Endpoints

```bash
GET /api/v1/restaurants
  Query params:
    - q (string): Full-text search
    - district (string): Filter by district
    - category (string): Filter by category
    - minPrice (number): Minimum price in VND
    - maxPrice (number): Maximum price in VND
    - page (number): Pagination (default: 1)
    - limit (number): Items per page (default: 20, max: 100)
    - sort (string): Sorting field (name, price, district)
    - order (string): asc | desc

GET /api/v1/restaurants/:id
  - Chi tiết một quán

GET /api/v1/filters
  - Trả về danh sách districts, categories, price ranges có sẵn

GET /api/v1/random
  - Trả về một quán ngẫu nhiên

POST /api/v1/admin/reload
  - Reload CSV data (protected endpoint)
```

### Response Format

```typescript
interface APIResponse<T> {
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
```

## Architecture

```bash
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐│
│  │   Home   │  │  Search  │  │  Detail  │  │  Admin (Upload)  ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘│
│                         │                                       │
│                    React Query                                  │
│                    (API Cache)                                  │
└─────────────────────────│───────────────────────────────────────┘
                          │ HTTP/JSON
┌─────────────────────────│───────────────────────────────────────┐
│                    Backend (Express)                            │
│  ┌──────────────────────▼──────────────────────────────────┐   │
│  │              API Routes + Validation (Zod)              │   │
│  └──────────────────────┬──────────────────────────────────┘   │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────────┐   │
│  │           Service Layer (Business Logic)                │   │
│  │    - Search & Filter                                    │   │
│  │    - Price parsing                                      │   │
│  │    - Data normalization                                 │   │
│  └──────────────────────┬──────────────────────────────────┘   │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────────┐   │
│  │              Data Layer (CSV Adapter)                   │   │
│  │    - Load CSV on startup                                │   │
│  │    - In-memory cache (refreshable)                      │   │
│  │    - File watcher for auto-reload                       │   │
│  └──────────────────────┬──────────────────────────────────┘   │
│                         │                                       │
└─────────────────────────│───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                     CSV Files (Data)                            │
│  - Food tour SG - HCM.csv                                       │
│  - SAIGON EVERYFOOD.xlsx - Ăn ún no nê.csv                     │
└─────────────────────────────────────────────────────────────────┘
```

### Caching Strategy
1. **Startup**: Load và normalize tất cả CSV vào memory
2. **Runtime**: Serve từ in-memory cache, không đọc file
3. **Refresh**: Admin endpoint hoặc file watcher trigger reload
4. **Frontend**: React Query cache với staleTime phù hợp (5-10 phút)

## Testing Strategy

- **Unit Tests**: Jest cho utility functions (price parser, normalizer)
- **Integration Tests**: Supertest cho API endpoints
- **E2E Tests**: Playwright cho critical user flows
- **Code Coverage**: Tối thiểu 70%

## Security Considerations

- Rate limiting: 100 requests/minute per IP
- Input sanitization cho search queries (prevent injection)
- Admin endpoints protected với API key hoặc JWT
- CORS whitelist cho production domains

## Environment Configuration

```env
# .env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
CSV_DATA_PATH=./data
CACHE_TTL_SECONDS=300
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## Future Improvements (Optional)

- **Favorites**: localStorage để lưu quán yêu thích (không cần login)
