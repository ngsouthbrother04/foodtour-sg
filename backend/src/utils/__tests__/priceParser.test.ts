import { parsePrice, isPriceInRange } from '../priceParser';

describe('priceParser', () => {
  describe('parsePrice', () => {
    it('should parse range format "20k-25k"', () => {
      const result = parsePrice('20k-25k');
      expect(result).toEqual({
        min: 20000,
        max: 25000,
        display: '20k-25k',
      });
    });

    it('should parse "< 50k" format', () => {
      const result = parsePrice('< 50k');
      expect(result).toEqual({
        min: null,
        max: 50000,
        display: '< 50k',
      });
    });

    it('should parse "<50k" format (no space)', () => {
      const result = parsePrice('<50k');
      expect(result).toEqual({
        min: null,
        max: 50000,
        display: '<50k',
      });
    });

    it('should parse "> 100k" format', () => {
      const result = parsePrice('> 100k');
      expect(result).toEqual({
        min: 100000,
        max: null,
        display: '> 100k',
      });
    });

    it('should parse single price "45k"', () => {
      const result = parsePrice('45k');
      expect(result).toEqual({
        min: 45000,
        max: 45000,
        display: '45k',
      });
    });

    it('should handle "Nhiều giá"', () => {
      const result = parsePrice('Nhiều giá');
      expect(result).toEqual({
        min: null,
        max: null,
        display: 'Nhiều giá',
      });
    });

    it('should parse multi-range "280k-350k-450k"', () => {
      const result = parsePrice('280k-350k-450k');
      expect(result).toEqual({
        min: 280000,
        max: 450000,
        display: '280k-350k-450k',
      });
    });

    it('should parse "15 - 25k" with spaces', () => {
      const result = parsePrice('15 - 25k');
      expect(result).toEqual({
        min: 15000,
        max: 25000,
        display: '15 - 25k',
      });
    });

    it('should handle null/undefined input', () => {
      expect(parsePrice(null)).toEqual({
        min: null,
        max: null,
        display: 'Liên hệ',
      });
      expect(parsePrice(undefined)).toEqual({
        min: null,
        max: null,
        display: 'Liên hệ',
      });
    });

    it('should handle empty string', () => {
      expect(parsePrice('')).toEqual({
        min: null,
        max: null,
        display: 'Liên hệ',
      });
    });
  });

  describe('isPriceInRange', () => {
    it('should return true when price is within range', () => {
      const price = { min: 20000, max: 30000, display: '20k-30k' };
      expect(isPriceInRange(price, 15000, 35000)).toBe(true);
    });

    it('should return true when only minPrice is specified', () => {
      const price = { min: 50000, max: 60000, display: '50k-60k' };
      expect(isPriceInRange(price, 40000, undefined)).toBe(true);
    });

    it('should return true when only maxPrice is specified', () => {
      const price = { min: 20000, max: 30000, display: '20k-30k' };
      expect(isPriceInRange(price, undefined, 50000)).toBe(true);
    });

    it('should return false when price is below range', () => {
      const price = { min: 20000, max: 30000, display: '20k-30k' };
      expect(isPriceInRange(price, 50000, 100000)).toBe(false);
    });

    it('should return false when price is above range', () => {
      const price = { min: 100000, max: 150000, display: '100k-150k' };
      expect(isPriceInRange(price, 10000, 50000)).toBe(false);
    });

    it('should return true when price has null values and no filter', () => {
      const price = { min: null, max: null, display: 'Liên hệ' };
      expect(isPriceInRange(price, undefined, undefined)).toBe(true);
    });
  });
});
