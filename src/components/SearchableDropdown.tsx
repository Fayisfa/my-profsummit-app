import React, { useState, useMemo, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

interface SearchableDropdownProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  placeholder?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  selected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const filteredOptions = useMemo(() =>
    ['all', ...options].filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [options, searchTerm]
  );
  
  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getDisplayName = (value: string) => {
    return value === 'all' ? 'All Districts' : value;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* The main button that shows the selected value */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between pl-4 pr-3 py-3 border border-slate-200 rounded-xl text-sm bg-white shadow-sm hover:shadow-md transition-all"
      >
        <span className={selected === 'all' ? 'text-slate-500' : 'text-slate-800 font-medium'}>
          {getDisplayName(selected)}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* The dropdown panel with search and options */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-100 z-10 p-2">
          {/* Search Input */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search districts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map(option => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selected === option ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {getDisplayName(option)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
