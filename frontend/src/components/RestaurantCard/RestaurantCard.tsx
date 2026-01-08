import React from 'react';
import { Card, Tag, Typography, Space } from 'antd';
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../../types';

const { Text, Title } = Typography;

interface RestaurantCardProps {
  restaurant: Restaurant;
  highlight?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, highlight }) => {
  const navigate = useNavigate();

  const highlightText = (text: string) => {
    if (!highlight || !text) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="search-highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

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
    <Card
      className="restaurant-card cursor-pointer h-full"
      hoverable
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      <Space direction="vertical" size="small" className="w-full">
        {/* Category Tag */}
        <Tag color={getCategoryColor(restaurant.category)}>{restaurant.category}</Tag>

        {/* Restaurant Name */}
        <Title level={5} className="!mb-0 !mt-1">
          {highlightText(restaurant.name)}
        </Title>

        {/* Dish Name */}
        {restaurant.dish && (
          <Text type="secondary" className="text-sm">
            🍜 {highlightText(restaurant.dish)}
          </Text>
        )}

        {/* Location */}
        <div className="flex items-start gap-1 text-gray-600 dark:text-gray-400">
          <EnvironmentOutlined className="mt-1 flex-shrink-0" />
          <Text className="text-sm">
            {restaurant.address && `${restaurant.address}, `}
            {restaurant.district}
          </Text>
        </div>

        {/* Price */}
        {restaurant.priceRange.display && (
          <div className="flex items-center gap-1">
            <DollarOutlined className="text-primary-500" />
            <span className="price-tag">{restaurant.priceRange.display}</span>
          </div>
        )}

        {/* Opening Hours */}
        {restaurant.openingHours && (
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <ClockCircleOutlined />
            <Text type="secondary">{restaurant.openingHours}</Text>
          </div>
        )}

        {/* Review snippet */}
        {restaurant.review && (
          <Text
            type="secondary"
            className="text-xs italic line-clamp-2"
            ellipsis={{ tooltip: restaurant.review }}
          >
            "{restaurant.review}"
          </Text>
        )}
      </Space>
    </Card>
  );
};

export default RestaurantCard;
