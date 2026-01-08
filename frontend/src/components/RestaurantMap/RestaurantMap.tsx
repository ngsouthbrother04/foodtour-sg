import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icon mặc định của Leaflet trong React
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface RestaurantMapProps {
  name: string;
  address: string;
  district: string;
  className?: string;
}

// Tọa độ trung tâm các quận HCM
const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  'Quận 1': [10.7756, 106.7004],
  'Quận 2': [10.7868, 106.7512],
  'Quận 3': [10.7834, 106.6869],
  'Quận 4': [10.7578, 106.7012],
  'Quận 5': [10.7540, 106.6633],
  'Quận 6': [10.7468, 106.6352],
  'Quận 7': [10.7340, 106.7217],
  'Quận 8': [10.7240, 106.6283],
  'Quận 9': [10.8483, 106.7830],
  'Quận 10': [10.7726, 106.6672],
  'Quận 11': [10.7621, 106.6502],
  'Quận 12': [10.8671, 106.6413],
  'Quận Bình Thạnh': [10.8105, 106.7091],
  'Quận Phú Nhuận': [10.7996, 106.6802],
  'Quận Tân Bình': [10.8015, 106.6528],
  'Quận Tân Phú': [10.7900, 106.6281],
  'Quận Gò Vấp': [10.8386, 106.6652],
  'Quận Bình Tân': [10.7654, 106.6037],
  'TP. Thủ Đức': [10.8544, 106.7530],
  'Huyện Bình Chánh': [10.6833, 106.5833],
  'Huyện Hóc Môn': [10.8867, 106.5931],
  'Huyện Củ Chi': [10.9730, 106.4930],
  'Huyện Nhà Bè': [10.6958, 106.7369],
  'Huyện Cần Giờ': [10.4114, 106.9569],
};

const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009];

const RestaurantMap: React.FC<RestaurantMapProps> = ({
  name,
  address,
  district,
  className = '',
}) => {
  const position = useMemo(() => {
    return DISTRICT_COORDINATES[district] || DEFAULT_CENTER;
  }, [district]);

  const fullAddress = address ? `${address}, ${district}` : district;

  return (
    <div className={`h-64 w-full rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={defaultIcon}>
          <Popup>
            <div className="text-center">
              <strong>{name}</strong>
              <br />
              <span className="text-gray-600 text-sm">{fullAddress}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default RestaurantMap;
