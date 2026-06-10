
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterX } from 'lucide-react';

const ChannelsFilter = ({ filters, onFilterChange, categories }) => {
  const handleReset = () => {
    onFilterChange({ category: 'all', status: 'all' });
  };

  const activeFiltersCount = (filters.category !== 'all' ? 1 : 0) + (filters.status !== 'all' ? 1 : 0);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#0a0a0a]/50 p-4 rounded-xl border border-slate-800">
      <div className="text-sm font-medium text-slate-300 w-full sm:w-auto">Filtrele:</div>
      
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Select value={filters.category} onValueChange={(val) => onFilterChange({ ...filters, category: val })}>
          <SelectTrigger className="w-full bg-[#0a0a0a] border-slate-700 text-white">
            <SelectValue placeholder="Kategori Seç" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-slate-700 text-white">
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(val) => onFilterChange({ ...filters, status: val })}>
          <SelectTrigger className="w-full bg-[#0a0a0a] border-slate-700 text-white">
            <SelectValue placeholder="Durum Seç" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-slate-700 text-white">
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Sadece Aktif</SelectItem>
            <SelectItem value="inactive">Sadece Pasif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-400 hover:text-white w-full sm:w-auto">
          <FilterX className="w-4 h-4 mr-2" />
          Temizle ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
};

export default ChannelsFilter;
