import React from 'react';
import { Select, Space, Button, Card, InputNumber, Row, Col } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { SearchParams, SortField, SortOrder } from '../../types';

interface FilterPanelProps {
  filters: SearchParams;
  onFilterChange: (filters: SearchParams) => void;
  districts: string[];
  categories: string[];
  loading?: boolean;
}

const PRICE_PRESETS = [
  { label: 'Tất cả', min: undefined, max: undefined },
  { label: '< 30k', min: undefined, max: 30000 },
  { label: '30k - 50k', min: 30000, max: 50000 },
  { label: '50k - 100k', min: 50000, max: 100000 },
  { label: '> 100k', min: 100000, max: undefined },
];

const SORT_OPTIONS = [
  { value: SortField.NAME, label: 'Tên quán' },
  { value: SortField.PRICE, label: 'Giá' },
  { value: SortField.DISTRICT, label: 'Quận' },
];

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  districts,
  categories,
  loading = false,
}) => {
  const handleDistrictChange = (value: string | undefined) => {
    onFilterChange({ ...filters, district: value, page: 1 });
  };

  const handleCategoryChange = (value: string | undefined) => {
    onFilterChange({ ...filters, category: value, page: 1 });
  };

  const handlePricePreset = (min?: number, max?: number) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max, page: 1 });
  };

  const handleMinPriceChange = (value: number | null) => {
    onFilterChange({ ...filters, minPrice: value || undefined, page: 1 });
  };

  const handleMaxPriceChange = (value: number | null) => {
    onFilterChange({ ...filters, maxPrice: value || undefined, page: 1 });
  };

  const handleSortChange = (value: SortField) => {
    onFilterChange({ ...filters, sort: value });
  };

  const handleOrderChange = (value: SortOrder) => {
    onFilterChange({ ...filters, order: value });
  };

  const handleClearFilters = () => {
    onFilterChange({
      page: 1,
      limit: filters.limit,
    });
  };

  const hasActiveFilters =
    filters.district || filters.category || filters.minPrice || filters.maxPrice || filters.q;

  return (
    <Card className="mb-4">
      <Space direction="vertical" size="middle" className="w-full">
        <div className="flex items-center justify-between">
          <Space>
            <FilterOutlined />
            <span className="font-medium">Bộ lọc</span>
          </Space>
          {hasActiveFilters && (
            <Button
              type="text"
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
              size="small"
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div className="mb-1 text-sm text-gray-600">Quận/Huyện</div>
            <Select
              placeholder="Chọn quận"
              value={filters.district}
              onChange={handleDistrictChange}
              allowClear
              className="w-full"
              loading={loading}
              options={districts.map((d) => ({ value: d, label: d }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="mb-1 text-sm text-gray-600">Loại món</div>
            <Select
              placeholder="Chọn loại món"
              value={filters.category}
              onChange={handleCategoryChange}
              allowClear
              className="w-full"
              loading={loading}
              options={categories.map((c) => ({ value: c, label: c }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="mb-1 text-sm text-gray-600">Khoảng giá</div>
            <Space.Compact className="w-full">
              <InputNumber
                placeholder="Từ"
                value={filters.minPrice}
                onChange={handleMinPriceChange}
                formatter={(value) => (value ? `${value / 1000}k` : '')}
                parser={(value) => {
                  const num = parseInt(value?.replace('k', '') || '0', 10);
                  return (num * 1000) as unknown as 0;
                }}
                className="w-1/2"
                min={0}
                step={10000}
              />
              <InputNumber
                placeholder="Đến"
                value={filters.maxPrice}
                onChange={handleMaxPriceChange}
                formatter={(value) => (value ? `${value / 1000}k` : '')}
                parser={(value) => {
                  const num = parseInt(value?.replace('k', '') || '0', 10);
                  return (num * 1000) as unknown as 0;
                }}
                className="w-1/2"
                min={0}
                step={10000}
              />
            </Space.Compact>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="mb-1 text-sm text-gray-600">Sắp xếp</div>
            <Space.Compact className="w-full">
              <Select
                value={filters.sort || SortField.NAME}
                onChange={handleSortChange}
                options={SORT_OPTIONS}
                className="w-2/3"
              />
              <Select
                value={filters.order || SortOrder.ASC}
                onChange={handleOrderChange}
                options={[
                  { value: SortOrder.ASC, label: '↑' },
                  { value: SortOrder.DESC, label: '↓' },
                ]}
                className="w-1/3"
              />
            </Space.Compact>
          </Col>

        </Row>

        <div>
          <div className="mb-2 text-sm text-gray-600">Mức giá nhanh</div>
          <Space wrap>
            {PRICE_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                type={
                  filters.minPrice === preset.min && filters.maxPrice === preset.max
                    ? 'primary'
                    : 'default'
                }
                size="small"
                onClick={() => handlePricePreset(preset.min, preset.max)}
              >
                {preset.label}
              </Button>
            ))}
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default FilterPanel;
