import React from 'react';
import { motion } from 'framer-motion';

const AdminTabWrapper = ({ 
  children, 
  title, 
  description, 
  actions,
  icon: Icon 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="admin-section-header">
            {Icon && <Icon className="w-8 h-8 text-purple-500" />}
            {title}
          </h2>
          {description && <p className="admin-section-desc mb-0">{description}</p>}
        </div>
        {actions && (
          <div className="flex flex-wrap gap-3">
            {actions}
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {children}
      </div>
    </motion.div>
  );
};

export default AdminTabWrapper;