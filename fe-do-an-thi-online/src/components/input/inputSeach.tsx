// components/InputSearch.tsx
import { FC, useState } from 'react';
import { Search } from 'lucide-react';

interface InputSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const InputSearch: FC<InputSearchProps> = ({ onSearch, placeholder = "Tìm kiếm..." }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="relative w-full flex justify-center">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
        className="border rounded-3xl px-4 py-2 w-full focus:outline-none focus:border-gray-500"
        placeholder={placeholder}
      />
      <button
        onClick={handleSearch}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 px-4 py-0 text-gray-500 rounded-xl focus:outline-none focus:border-gray-500 "
      >
        <Search/>
      </button>
    </div>
  );
};

export default InputSearch;
