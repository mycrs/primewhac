
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const StatCard = ({ label, value, suffix, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center p-6"
    >
      <div className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#e50914] to-[#b20710] mb-2 font-mono">
        {value}{suffix}
      </div>
      <div className="text-slate-400 font-medium tracking-wide uppercase text-sm">
        {label}
      </div>
    </motion.div>
  );
};

const SuccessStatsSection = () => {
  return (
    <section className="py-20 bg-[#0a0a0a] border-y border-slate-800">
      <h2 className="sr-only">Başarı İstatistiklerimiz</h2>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800/50">
          <StatCard label="Müşteri Sayısı" value="10,000" suffix="+" delay={0} />
          <StatCard label="Hizmet Yılı" value="5" suffix="+" delay={0.1} />
          <StatCard label="Başarı Oranı" value="99" suffix="%" delay={0.2} />
          <StatCard label="Destek Yanıt Süresi" value="1" suffix=" Saat" delay={0.3} />
        </div>
      </div>
    </section>
  );
};

export default SuccessStatsSection;
