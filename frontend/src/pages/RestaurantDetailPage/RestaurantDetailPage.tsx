import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Skeleton,
  Divider,
  Row,
  Col,
  Alert,
  Descriptions,
  Tooltip,
} from 'antd';
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { useRestaurant, useSimilarRestaurants, useTheme } from '../../hooks';
import { RestaurantCard, RestaurantMap } from '../../components';

const { Title, Text, Paragraph } = Typography;

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();

  const { data: restaurantData, isLoading, error } = useRestaurant(id || '');
  const { data: similarData } = useSimilarRestaurants(id || '', 4);

  const restaurant = restaurantData?.data;
  const similarRestaurants = similarData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-100 dark:bg-dark-bg p-4 transition-colors">
        <div className="max-w-4xl mx-auto">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-warm-100 dark:bg-dark-bg p-4 transition-colors">
        <div className="max-w-4xl mx-auto">
          <Alert
            message="Không tìm thấy quán ăn"
            description="Quán ăn này không tồn tại hoặc đã bị xóa."
            type="error"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate('/')}>
                Về trang chủ
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Bánh mì': 'orange',
      'Cơm': 'gold',
      'Món nước': 'blue',
      'Lẩu': 'red',
      'Ăn vặt': 'purple',
      'Cafe': 'brown',
      'Món Việt': 'green',
      'Món Nhật': 'pink',
      'Món Hàn': 'cyan',
      'Sang trọng': 'gold',
    };
    return colors[category] || 'default';
  };

  return (
    <div className="min-h-screen bg-warm-100 dark:bg-dark-bg transition-colors">
      <div className="bg-white dark:bg-dark-card shadow-sm sticky top-0 z-10 transition-colors">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Tooltip title={mode === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}>
            <button
              onClick={toggleTheme}
              className="theme-toggle text-lg"
              aria-label="Toggle theme"
            >
              {mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <Space direction="vertical" size="middle" className="w-full">
            <div className="flex flex-wrap items-center gap-2">
              <Tag color={getCategoryColor(restaurant.category)} className="text-base px-3 py-1">
                {restaurant.category}
              </Tag>
              <Tag color="blue">{restaurant.source === 'foodtour' ? 'Food Tour SG' : 'Saigon Everyfood'}</Tag>
            </div>

            <Title level={2} className="!mb-0">
              {restaurant.name}
            </Title>

            {restaurant.dish && (
              <Text className="text-lg text-gray-600">
                🍜 {restaurant.dish}
              </Text>
            )}
          </Space>

          <Divider />

          <Descriptions column={{ xs: 1, sm: 2 }} labelStyle={{ fontWeight: 500 }}>
            <Descriptions.Item
              label={
                <Space>
                  <EnvironmentOutlined />
                  Địa chỉ
                </Space>
              }
              span={2}
            >
              {restaurant.address && `${restaurant.address}, `}
              {restaurant.district}
            </Descriptions.Item>

            {restaurant.priceRange.display && (
              <Descriptions.Item
                label={
                  <Space>
                    <DollarOutlined />
                    Khoảng giá
                  </Space>
                }
              >
                <span className="price-tag text-base">
                  {restaurant.priceRange.display}
                </span>
              </Descriptions.Item>
            )}

            {restaurant.openingHours && (
              <Descriptions.Item
                label={
                  <Space>
                    <ClockCircleOutlined />
                    Giờ mở cửa
                  </Space>
                }
              >
                {restaurant.openingHours}
              </Descriptions.Item>
            )}
          </Descriptions>

          {(restaurant.note || restaurant.review || restaurant.feedback) && (
            <>
              <Divider />
              <Space direction="vertical" size="middle" className="w-full">
                {restaurant.note && (
                  <div>
                    <Text strong className="flex items-center gap-1 mb-2">
                      <InfoCircleOutlined />
                      Ghi chú
                    </Text>
                    <Paragraph 
                      className="bg-gray-50 dark:bg-dark-card p-3 rounded-lg !mb-0 whitespace-pre-wrap"
                      ellipsis={{ rows: 5, expandable: true, symbol: 'Xem thêm' }}
                    >
                      {restaurant.note}
                    </Paragraph>
                  </div>
                )}

                {restaurant.review && (
                  <div>
                    <Text strong className="flex items-center gap-1 mb-2">
                      ⭐ Review
                    </Text>
                    <Paragraph 
                      className="bg-primary-50 dark:bg-dark-card p-3 rounded-lg !mb-0 italic whitespace-pre-wrap"
                      ellipsis={{ rows: 5, expandable: true, symbol: 'Xem thêm' }}
                    >
                      "{restaurant.review}"
                    </Paragraph>
                  </div>
                )}

                {restaurant.feedback && (
                  <div>
                    <Text strong className="flex items-center gap-1 mb-2">
                      💬 Feedback
                    </Text>
                    <Paragraph 
                      className="bg-blue-50 dark:bg-dark-card p-3 rounded-lg !mb-0 whitespace-pre-wrap"
                      ellipsis={{ rows: 5, expandable: true, symbol: 'Xem thêm' }}
                    >
                      {restaurant.feedback}
                    </Paragraph>
                  </div>
                )}
              </Space>
            </>
          )}

          <Divider />
          <div>
            <Text strong className="flex items-center gap-1 mb-2">
              <EnvironmentOutlined />
              Vị trí trên bản đồ
            </Text>
            <RestaurantMap
              name={restaurant.name}
              address={restaurant.address}
              district={restaurant.district}
            />
          </div>

          <Divider />
          <Space wrap>
            <Button
              type="primary"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/${encodeURIComponent(
                    `${restaurant.name} ${restaurant.address} ${restaurant.district}`
                  )}`,
                  '_blank'
                )
              }
            >
              <EnvironmentOutlined />
              Xem trên Google Maps
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
            >
              📋 Copy link
            </Button>
          </Space>
        </Card>

        {similarRestaurants.length > 0 && (
          <div className="mt-8">
            <Title level={4}>🍴 Quán tương tự</Title>
            <Row gutter={[16, 16]}>
              {similarRestaurants.map((r) => (
                <Col key={r.id} xs={24} sm={12} md={6}>
                  <RestaurantCard restaurant={r} />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
