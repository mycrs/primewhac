
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, FilterX } from 'lucide-react';

const ChannelsSearch = ({ onSearch, onFilterChange, filters, categories, resultCount }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleClearFilters = () => {
    onFilterChange({ category: 'all', status: 'all' });
  };

  const hasActiveFilters = filters.category !== 'all' || filters.status !== 'all';

  return (
    <div className="bg-[#0a0a0a]/50 p-4 rounded-xl border border-slate-800 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Kanal adı veya açıklama ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 bg-[#0a0a0a] border-slate-800 text-white w-full h-11"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <Select value={filters.category} onValueChange={(val) => onFilterChange({ ...filters, category: val })}>
            <SelectTrigger className="w-full bg-[#0a0a0a] border-slate-800 text-white h-11">
              <SelectValue placeholder="Tüm Kategoriler" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-slate-800 text-white">
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <Select value={filters.status} onValueChange={(val) => onFilterChange({ ...filters, status: val })}>
            <SelectTrigger className="w-full bg-[#0a0a0a] border-slate-800 text-white h-11">
              <SelectValue placeholder="Tüm Durumlar" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-slate-800 text-white">
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="active">Sadece Aktif</SelectItem>
              <SelectItem value="inactive">Sadece Pasif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            className="h-11 border-slate-700 text-slate-300 hover:bg-[#0a0a0a] hover:text-white shrink-0"
          >
            <FilterX className="w-4 h-4 mr-2" />
            Temizle
          </Button>
        )}
      </div>

      <div className="text-sm text-slate-400 flex items-center justify-between border-t border-slate-800/50 pt-3 mt-3">
        <span>Toplam <strong className="text-white">{resultCount}</strong> kanal listeleniyor</span>
      </div>
    </div>
  );
};

export default ChannelsSearch;
