import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const springValue = useSpring(0, { duration: 3000, bounce: 0 });
  
  // Convert value string "50K+" to number 50000 for animation if needed, 
  // but simpler approach for "50" then append "K+" visually
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest).toLocaleString('tr-TR'));

  useEffect(() => {
    if (inView) {
      springValue.set(numericValue);
    }
  }, [inView, numericValue, springValue]);

  return (
    <span ref={ref} className="flex justify-center items-center">
      <motion.span>{displayValue}</motion.span>
      <span>{value.replace(/[0-9]/g, '')}{suffix}</span>
    </span>
  );
};

const StatItem = ({ label, value, subtext, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="flex flex-col items-center p-6 text-center"
    >
      <h3 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] mb-2 font-mono tracking-tight">
        <AnimatedCounter value={value} />
      </h3>
      <p className="text-xl font-bold text-white mb-2">{label}</p>
      <p className="text-sm text-gray-400">{subtext}</p>
    </motion.div>
  );
};

const WelcomePageStats = () => {
  const stats = [
    { label: "Kullanıcı", value: "50000", subtext: "Mutlu Müşteri" },
    { label: "Kanal", value: "10000+", subtext: "4K/HD Yayın" },
    { label: "Film & Dizi", value: "85000", subtext: "Sürekli Güncel Arşiv" },
    { label: "Uptime", value: "99", suffix: "%", subtext: "Kesintisiz Hizmet" }
  ];

  return (
    <section className="py-20 bg-[#0A0A16] border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-white/5">
          {stats.map((stat, index) => (
            <StatItem 
              key={index} 
              {...stat} 
              delay={index * 0.1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WelcomePageStats;