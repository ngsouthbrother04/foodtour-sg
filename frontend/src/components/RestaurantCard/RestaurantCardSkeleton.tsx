import React from 'react';
import { Card, Skeleton, Space } from 'antd';

const RestaurantCardSkeleton: React.FC = () => {
  return (
    <Card className="h-full">
      <Space direction="vertical" size="small" className="w-full">
        <Skeleton.Button active size="small" style={{ width: 60 }} />
        <Skeleton.Input active size="small" block />
        <Skeleton.Input active size="small" block style={{ width: '80%' }} />
        <Skeleton.Input active size="small" block style={{ width: '60%' }} />
        <Skeleton.Button active size="small" style={{ width: 80 }} />
      </Space>
    </Card>
  );
};

export default RestaurantCardSkeleton;
