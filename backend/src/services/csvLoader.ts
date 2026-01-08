import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Restaurant } from '../types/restaurant';
import { DataSource } from '../types/enums';
import { parsePrice } from '../utils/priceParser';
import { normalizeDistrict } from '../utils/districtNormalizer';

// CSV row types theo cấu trúc file
interface FoodTourRow {
  STT: string;
  'Tên quán': string;
  'Tên món': string;
  'Phân loại món': string;
  'Tên đường': string;
  'Quận': string;
  'Giờ mở cửa': string;
  'Khoảng giá': string;
  'Note': string;
}

interface SaigonEveryFoodRow {
  'Loại quán': string;
  'Món - Quán': string;
  'ĐỊA CHỈ - CN': string;
  'Quận': string;
  'Giá tiền': string;
  'Review': string;
  'FEEDBACK MN': string;
}

let restaurantsCache: Restaurant[] = [];
let isLoaded = false;

function generateId(name: string, address: string, index: number): string {
  const slug = `${name}-${address}`
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
  return `${slug}-${index}`;
}

function normalizeCategory(category: string | null | undefined): string {
  if (!category) return 'Khác';
  
  const cleaned = category.trim();
  
  const categoryMap: Record<string, string> = {
    'bánh mì': 'Bánh mì',
    'cơm': 'Cơm',
    'cơm tấm': 'Cơm',
    'món nước': 'Món nước',
    'lẩu': 'Lẩu',
    'ăn vặt': 'Ăn vặt',
    'cafe': 'Cafe',
    'quán nước': 'Cafe',
    'món việt': 'Món Việt',
    'món nhật': 'Món Nhật',
    'món hàn': 'Món Hàn',
    'món thái': 'Món Thái',
    'sang choảnh - không gian xinh': 'Sang trọng',
    'món khô': 'Món khô',
  };

  const lower = cleaned.toLowerCase();
  return categoryMap[lower] || cleaned;
}

function parseFoodTourCSV(filePath: string): Restaurant[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const result = Papa.parse<FoodTourRow>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row, index): Restaurant => ({
    id: generateId(row['Tên quán'] || '', row['Tên đường'] || '', index),
    name: row['Tên quán']?.trim() || 'Không tên',
    dish: row['Tên món']?.trim() || '',
    category: normalizeCategory(row['Phân loại món']),
    address: row['Tên đường']?.trim() || '',
    district: normalizeDistrict(row['Quận']),
    openingHours: row['Giờ mở cửa']?.trim() || null,
    priceRange: parsePrice(row['Khoảng giá']),
    note: row['Note']?.trim() || null,
    review: null,
    feedback: null,
    source: DataSource.FOODTOUR,
  }));
}

// File Saigon Everyfood có dòng đầu là tiêu đề, dòng 2 mới là header
function parseSaigonEveryFoodCSV(filePath: string): Restaurant[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const lines = fileContent.split('\n');
  const contentWithoutTitle = lines.slice(1).join('\n');
  
  const result = Papa.parse<SaigonEveryFoodRow>(contentWithoutTitle, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data
    .filter(row => row['Món - Quán'] && row['Quận']) // Filter out header/empty rows
    .map((row, index): Restaurant => ({
      id: generateId(row['Món - Quán'] || '', row['ĐỊA CHỈ - CN'] || '', index + 1000),
      name: row['Món - Quán']?.trim() || 'Không tên',
      dish: row['Món - Quán']?.trim() || '',
      category: normalizeCategory(row['Loại quán']),
      address: row['ĐỊA CHỈ - CN']?.trim() || '',
      district: normalizeDistrict(row['Quận']),
      openingHours: null,
      priceRange: parsePrice(row['Giá tiền']),
      note: null,
      review: row['Review']?.trim() || null,
      feedback: row['FEEDBACK MN']?.trim() || null,
      source: DataSource.SAIGON_EVERYFOOD,
    }));
}

export function loadAllData(dataDir: string): Restaurant[] {
  const foodTourPath = path.join(dataDir, 'Food tour SG - HCM.csv');
  const saigonEveryFoodPath = path.join(dataDir, 'SAIGON EVERYFOOD.xlsx - Ăn ún no nê.csv');

  const restaurants: Restaurant[] = [];

  if (fs.existsSync(foodTourPath)) {
    console.log('📂 Loading Food Tour CSV...');
    const foodTourData = parseFoodTourCSV(foodTourPath);
    console.log(`   ✅ Loaded ${foodTourData.length} restaurants`);
    restaurants.push(...foodTourData);
  }

  if (fs.existsSync(saigonEveryFoodPath)) {
    console.log('📂 Loading Saigon Every Food CSV...');
    const saigonData = parseSaigonEveryFoodCSV(saigonEveryFoodPath);
    console.log(`   ✅ Loaded ${saigonData.length} restaurants`);
    restaurants.push(...saigonData);
  }

  console.log(`\n🍜 Total: ${restaurants.length} restaurants loaded!\n`);
  
  restaurantsCache = restaurants;
  isLoaded = true;
  
  return restaurants;
}

export function getRestaurants(): Restaurant[] {
  return restaurantsCache;
}

export function isDataLoaded(): boolean {
  return isLoaded;
}

export function reloadData(dataDir: string): Restaurant[] {
  console.log('🔄 Reloading data...');
  return loadAllData(dataDir);
}
