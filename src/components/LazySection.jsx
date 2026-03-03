import React from 'react';
import { motion } from 'framer-motion';

const LazySection = ({ children, className = '', threshold = 0.1, rootMargin = '50px' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold, margin: rootMargin }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default LazySection;