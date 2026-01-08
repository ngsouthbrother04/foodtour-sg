import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Pagination, Empty, Button, Typography, Alert, Tooltip } from 'antd';
import { ReloadOutlined, QuestionCircleOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import {
  RestaurantCard,
  RestaurantCardSkeleton,
  SearchBar,
  FilterPanel,
} from '../../components';
import { useRestaurants, useFilterOptions, useRandomRestaurant, useTheme } from '../../hooks';
import { SearchParams, SortField, SortOrder } from '../../types';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();

  const getFiltersFromURL = (): SearchParams => ({
    q: searchParams.get('q') || undefined,
    district: searchParams.get('district') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
    limit: 20,
    sort: (searchParams.get('sort') as SortField) || SortField.NAME,
    order: (searchParams.get('order') as SortOrder) || SortOrder.ASC,
  });

  const [filters, setFilters] = useState<SearchParams>(getFiltersFromURL);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.district) params.set('district', filters.district);
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
    if (filters.sort && filters.sort !== 'name') params.set('sort', filters.sort);
    if (filters.order && filters.order !== 'asc') params.set('order', filters.order);
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const { data: restaurantsData, isLoading, error, refetch } = useRestaurants(filters);
  const { data: filterOptionsData } = useFilterOptions();
  const { data: randomData, refetch: fetchRandom, isFetching: isRandomFetching } = useRandomRestaurant();

  const restaurants = restaurantsData?.data || [];
  const meta = restaurantsData?.meta;
  const filterOptions = filterOptionsData?.data;

  const handleSearch = (q: string) => {
    setFilters((prev) => ({ ...prev, q: q || undefined, page: 1 }));
  };

  const handleFilterChange = (newFilters: SearchParams) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRandomClick = () => {
    fetchRandom();
  };

  return (
    <div className="min-h-screen bg-warm-100 dark:bg-dark-bg transition-colors duration-300">
      <div className="header-gradient text-white py-8 px-4 relative">
        <Tooltip title={mode === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}>
          <button
            onClick={toggleTheme}
            className="theme-toggle absolute top-4 right-4 text-lg"
            aria-label="Toggle theme"
          >
            {mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
          </button>
        </Tooltip>
        
        <div className="max-w-6xl mx-auto">
          <Title level={1} className="!text-white !mb-2">
            🍜 Food Tour Sài Gòn
          </Title>
          <Text className="text-primary-200 text-lg block mb-6">
            Khám phá ẩm thực Sài Gòn từ gợi ý của cộng đồng
          </Text>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchBar
              onSearch={handleSearch}
              defaultValue={filters.q}
              loading={isLoading}
            />
            <Button
              type="default"
              icon={<QuestionCircleOutlined />}
              onClick={handleRandomClick}
              loading={isRandomFetching}
              size="large"
              className="bg-white/90 hover:bg-white border-0"
            >
              Hôm nay ăn gì?
            </Button>
          </div>
        </div>
      </div>

      {randomData?.data && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <Alert
            message={
              <span>
                🎲 Gợi ý cho bạn:{' '}
                <a
                  href={`/restaurant/${randomData.data.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/restaurant/${randomData.data.id}`);
                  }}
                  className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline cursor-pointer"
                >
                  {randomData.data.name}
                </a>{' '}
                - {randomData.data.dish} ({randomData.data.district})
              </span>
            }
            type="success"
            showIcon
            closable
            action={
              <Button size="small" onClick={handleRandomClick}>
                Thử lại
              </Button>
            }
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          districts={filterOptions?.districts || []}
          categories={filterOptions?.categories || []}
          loading={!filterOptions}
        />

        <div className="flex justify-between items-center mb-4">
          <Text type="secondary">
            {meta ? (
              <>
                Tìm thấy <strong>{meta.total}</strong> quán ăn
                {filters.q && (
                  <>
                    {' '}
                    cho "<strong>{filters.q}</strong>"
                  </>
                )}
              </>
            ) : (
              'Đang tải...'
            )}
          </Text>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isLoading}
          >
            Làm mới
          </Button>
        </div>

        {error && (
          <Alert
            message="Lỗi"
            description="Không thể tải dữ liệu. Vui lòng thử lại sau."
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {isLoading ? (
          <Row gutter={[16, 16]}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Col key={i} xs={24} sm={12} md={8} lg={6}>
                <RestaurantCardSkeleton />
              </Col>
            ))}
          </Row>
        ) : restaurants.length > 0 ? (
          <Row gutter={[16, 16]}>
            {restaurants.map((restaurant) => (
              <Col key={restaurant.id} xs={24} sm={12} md={8} lg={6}>
                <RestaurantCard restaurant={restaurant} highlight={filters.q} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            description={
              <span>
                Không tìm thấy quán ăn nào
                {filters.q && (
                  <>
                    {' '}
                    cho "<strong>{filters.q}</strong>"
                  </>
                )}
              </span>
            }
          >
            <Button
              type="primary"
              onClick={() => setFilters({ page: 1, limit: 20 })}
            >
              Xóa bộ lọc
            </Button>
          </Empty>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={meta.page}
              total={meta.total}
              pageSize={meta.limit}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} trong ${total} quán`
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
