
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturesList = ({ features = [], onChange, error }) => {
  const [newFeature, setNewFeature] = useState('');

  const handleAdd = () => {
    if (newFeature.trim()) {
      onChange([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemove = (index) => {
    const updated = [...features];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Yeni özellik ekle (Örn: 4K Yayın Kalitesi)"
          className="bg-slate-900/50 border-slate-700 text-white"
          maxLength={100}
        />
        <Button 
          type="button" 
          onClick={handleAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" /> Ekle
        </Button>
      </div>
      <div className="text-xs text-slate-400 flex justify-between px-1">
        <span>{newFeature.length}/100 karakter</span>
        {error && <span className="text-red-400">{error}</span>}
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        <AnimatePresence>
          {features.map((feature, index) => (
            <motion.div
              key={`${feature}-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg border border-slate-700 group"
            >
              <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
              <span className="flex-1 text-sm text-slate-200">{feature}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {features.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-sm border-2 border-dashed border-slate-800 rounded-lg">
            Henüz özellik eklenmedi.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturesList;
