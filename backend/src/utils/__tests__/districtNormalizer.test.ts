import { normalizeDistrict } from '../districtNormalizer';

describe('districtNormalizer', () => {
  describe('normalizeDistrict', () => {
    it('should normalize number to "Quận X"', () => {
      expect(normalizeDistrict('1')).toBe('Quận 1');
      expect(normalizeDistrict('10')).toBe('Quận 10');
    });

    it('should normalize "Q1" to "Quận 1"', () => {
      expect(normalizeDistrict('Q1')).toBe('Quận 1');
      expect(normalizeDistrict('q1')).toBe('Quận 1');
      expect(normalizeDistrict('Q.1')).toBe('Quận 1');
    });

    it('should normalize "quận 1" to "Quận 1"', () => {
      expect(normalizeDistrict('quận 1')).toBe('Quận 1');
      expect(normalizeDistrict('Quận 1')).toBe('Quận 1');
    });

    it('should normalize named districts', () => {
      expect(normalizeDistrict('Bình Thạnh')).toBe('Quận Bình Thạnh');
      expect(normalizeDistrict('bình thạnh')).toBe('Quận Bình Thạnh');
      expect(normalizeDistrict('Phú Nhuận')).toBe('Quận Phú Nhuận');
    });

    it('should normalize Thu Duc to TP. Thủ Đức', () => {
      expect(normalizeDistrict('Thủ Đức')).toBe('TP. Thủ Đức');
      expect(normalizeDistrict('thủ đức')).toBe('TP. Thủ Đức');
    });

    it('should normalize suburban districts to Huyện', () => {
      expect(normalizeDistrict('Bình Chánh')).toBe('Huyện Bình Chánh');
      expect(normalizeDistrict('Hóc Môn')).toBe('Huyện Hóc Môn');
    });

    it('should handle null/undefined', () => {
      expect(normalizeDistrict(null)).toBe('Không xác định');
      expect(normalizeDistrict(undefined)).toBe('Không xác định');
    });

    it('should handle empty string', () => {
      expect(normalizeDistrict('')).toBe('Không xác định');
    });

    it('should handle already normalized values', () => {
      expect(normalizeDistrict('Quận Bình Thạnh')).toBe('Quận Bình Thạnh');
    });
  });
});
