// Chuẩn hóa tên quận: "1", "q1", "quận 1" → "Quận 1"
const DISTRICT_MAPPINGS: Record<string, string> = {
  '1': 'Quận 1',
  '2': 'Quận 2',
  '3': 'Quận 3',
  '4': 'Quận 4',
  '5': 'Quận 5',
  '6': 'Quận 6',
  '7': 'Quận 7',
  '8': 'Quận 8',
  '9': 'Quận 9',
  '10': 'Quận 10',
  '11': 'Quận 11',
  '12': 'Quận 12',
  'bình thạnh': 'Quận Bình Thạnh',
  'phú nhuận': 'Quận Phú Nhuận',
  'tân bình': 'Quận Tân Bình',
  'tân phú': 'Quận Tân Phú',
  'gò vấp': 'Quận Gò Vấp',
  'bình tân': 'Quận Bình Tân',
  'thủ đức': 'TP. Thủ Đức',
  'thu duc': 'TP. Thủ Đức',
  'bình chánh': 'Huyện Bình Chánh',
  'hóc môn': 'Huyện Hóc Môn',
  'củ chi': 'Huyện Củ Chi',
  'nhà bè': 'Huyện Nhà Bè',
  'cần giờ': 'Huyện Cần Giờ',
};

export function normalizeDistrict(district: string | null | undefined): string {
  if (!district) return 'Không xác định';
  
  let cleaned = district.trim().toLowerCase();
  
  // Remove "quận", "q.", "q", "huyện", "h." prefixes
  cleaned = cleaned
    .replace(/^quận\s*/i, '')
    .replace(/^q\.\s*/i, '')
    .replace(/^q\s*/i, '')
    .replace(/^huyện\s*/i, '')
    .replace(/^h\.\s*/i, '')
    .replace(/^tp\.\s*/i, '')
    .trim();

  // Check if it's a number (district 1-12)
  if (/^\d+$/.test(cleaned)) {
    return DISTRICT_MAPPINGS[cleaned] || `Quận ${cleaned}`;
  }

  // Check mapping
  if (DISTRICT_MAPPINGS[cleaned]) {
    return DISTRICT_MAPPINGS[cleaned];
  }

  // If already properly formatted, return as-is with proper capitalization
  if (district.toLowerCase().startsWith('quận ') || 
      district.toLowerCase().startsWith('huyện ') ||
      district.toLowerCase().startsWith('tp. ')) {
    // Capitalize properly
    return district.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  // Default: assume it's a district name
  return `Quận ${district.charAt(0).toUpperCase() + district.slice(1).toLowerCase()}`;
}

/**
 * Get list of all valid districts in HCMC
 */
export function getAllDistricts(): string[] {
  return [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5',
    'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
    'Quận 11', 'Quận 12',
    'Quận Bình Thạnh', 'Quận Phú Nhuận', 'Quận Tân Bình',
    'Quận Tân Phú', 'Quận Gò Vấp', 'Quận Bình Tân',
    'TP. Thủ Đức',
    'Huyện Bình Chánh', 'Huyện Hóc Môn', 'Huyện Củ Chi',
    'Huyện Nhà Bè', 'Huyện Cần Giờ'
  ];
}
