interface PriceRange {
  min: number | null;
  max: number | null;
  display: string;
}

// Parse các định dạng giá: "20k-25k", "<50k", ">100k", "45k", "Nhiều giá"
export function parsePrice(priceStr: string | null | undefined): PriceRange {
  const display = priceStr?.trim() || '';
  
  if (!display || display.toLowerCase() === 'nhiều giá') {
    return { min: null, max: null, display: display || 'Liên hệ' };
  }

  const toVND = (str: string): number | null => {
    if (!str) return null;
    const cleaned = str.toLowerCase().replace(/[,.\s]/g, '');
    const match = cleaned.match(/^(\d+)(k)?$/);
    if (match) {
      const num = parseInt(match[1], 10);
      return match[2] ? num * 1000 : num * 1000; // Assume numbers without 'k' are also in thousands
    }
    return null;
  };

  const lessThanMatch = display.match(/^[<~]\s*(\d+k?)/i);
  if (lessThanMatch) {
    return { min: null, max: toVND(lessThanMatch[1]), display };
  }

  const greaterThanMatch = display.match(/^>\s*(\d+k?)/i);
  if (greaterThanMatch) {
    return { min: toVND(greaterThanMatch[1]), max: null, display };
  }

  const rangeMatch = display.match(/(\d+k?)\s*[-–]\s*(\d+k?)(?:\s*[-–]\s*(\d+k?))?/i);
  if (rangeMatch) {
    const values = [rangeMatch[1], rangeMatch[2], rangeMatch[3]]
      .filter(Boolean)
      .map(toVND)
      .filter((v): v is number => v !== null)
      .sort((a, b) => a - b);
    
    if (values.length >= 2) {
      return { min: values[0], max: values[values.length - 1], display };
    }
  }

  const singleMatch = display.match(/^(\d+k?)$/i);
  if (singleMatch) {
    const value = toVND(singleMatch[1]);
    return { min: value, max: value, display };
  }

  return { min: null, max: null, display };
}

export function isPriceInRange(
  price: PriceRange,
  minPrice?: number,
  maxPrice?: number
): boolean {
  if (minPrice === undefined && maxPrice === undefined) return true;
  if (price.min === null && price.max === null) return true;

  if (minPrice !== undefined && price.max !== null && price.max < minPrice) {
    return false;
  }
  
  if (maxPrice !== undefined && price.min !== null && price.min > maxPrice) {
    return false;
  }

  return true;
}
