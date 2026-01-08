import React, { useState, useCallback } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from '../../utils/debounce';

const { Search } = Input;

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  defaultValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Tìm quán ăn, món ăn...',
  loading = false,
  defaultValue = '',
}) => {
  const [value, setValue] = useState(defaultValue);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      onSearch(searchValue);
    }, 300),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleSearch = (searchValue: string) => {
    onSearch(searchValue);
  };

  return (
    <Search
      value={value}
      onChange={handleChange}
      onSearch={handleSearch}
      placeholder={placeholder}
      allowClear
      enterButton={<SearchOutlined />}
      size="large"
      loading={loading}
      className="max-w-xl"
    />
  );
};

export default SearchBar;
