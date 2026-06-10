
import React from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, PieChart, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const EarningsCalculator = ({ 
  users, setUsers, 
  avgPrice, setAvgPrice, 
  commission, setCommission,
  labels = {
    userCount: "Kullanıcı Sayısı",
    userCount0: "0 Kullanıcı",
    userCount250: "250 Kullanıcı",
    userCount500: "500+ Kullanıcı",
    avgPrice: "Ortalama Paket Fiyatı",
    commission: "Komisyon Oranı",
    monthlyRevenue: "Aylık Ciro",
    monthlyProfit: "Aylık Kar",
    annualProfit: "Yıllık Net Kar"
  },
  locale = 'tr-TR',
  currencyCode = 'TRY',
  minPrice = 500,
  maxPrice = 2000,
  stepPrice = 50,
  priceMarks = ["500 ₺", "1250 ₺", "2000+ ₺"]
}) => {
  const monthlyRevenue = users * avgPrice;
  const monthlyProfit = (monthlyRevenue * commission) / 100;
  const annualProfit = monthlyProfit * 12;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 }).format(val);
  };

  const ResultCard = ({ title, value, icon: Icon, bgGradient, borderClass, hoverShadow, iconBg, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden group p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 ${bgGradient} ${borderClass} ${hoverShadow}`}
    >
      <div className="flex items-center gap-4 mb-3 relative z-10">
        <div className={`p-3 rounded-xl transition-colors duration-300 ${iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-3xl md:text-4xl font-black text-white relative z-10 drop-shadow-md">
        {formatCurrency(value)}
      </div>
    </motion.div>
  );

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border-2 border-slate-700/50 rounded-3xl p-6 sm:p-8 md:p-12 lg:p-14 shadow-2xl">
      <div className="space-y-12 md:space-y-16">
        {/* Sliders - PC'de 2 sütun, mobilde tek sütun */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* User Count Slider */}
          <div className="space-y-5">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-slate-200 font-bold text-lg">
              <Users className="w-5 h-5 text-primary" />
              {labels.userCount}
            </label>
            <span className="bg-gradient-to-r from-[#e50914]/20 to-[#b20710]/20 text-primary px-4 py-1.5 rounded-full font-mono text-lg font-black border border-primary/40 shadow-[0_0_15px_rgba(229,9,20,0.3)]">
              {users}
            </span>
          </div>
          <Slider
            value={[users]}
            onValueChange={(val) => setUsers(val[0])}
            max={500}
            step={10}
            className="py-3"
          />
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
            <span>{labels.userCount0}</span>
            <span>{labels.userCount250}</span>
            <span>{labels.userCount500}</span>
          </div>
          </div>

          {/* Average Price Slider */}
          <div className="space-y-5">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-slate-200 font-bold text-lg">
              <CreditCard className="w-5 h-5 text-[#e50914]" />
              {labels.avgPrice}
            </label>
            <span className="bg-gradient-to-r from-[#e50914]/20 to-[#b20710]/20 text-[#e50914] px-4 py-1.5 rounded-full font-mono text-lg font-black border border-[#e50914]/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {formatCurrency(avgPrice)}
            </span>
          </div>
          <Slider
            value={[avgPrice]}
            onValueChange={(val) => setAvgPrice(val[0])}
            min={minPrice}
            max={maxPrice}
            step={stepPrice}
            className="py-3"
          />
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
            <span>{priceMarks[0]}</span>
            <span>{priceMarks[1]}</span>
            <span>{priceMarks[2]}</span>
          </div>
          </div>
        </div>

        {/* Commission Rate Slider - tam genişlik */}
        <div className="space-y-5 max-w-2xl mx-auto lg:max-w-none">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-slate-200 font-bold text-lg">
              <PieChart className="w-5 h-5 text-blue-400" />
              {labels.commission}
            </label>
            <span className="bg-gradient-to-r from-[#e50914]/20 to-[#b20710]/20 text-blue-200 px-4 py-1.5 rounded-full font-mono text-lg font-black border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              %{commission}
            </span>
          </div>
          <Slider
            value={[commission]}
            onValueChange={(val) => setCommission(val[0])}
            min={10}
            max={50}
            step={5}
            className="py-3"
          />
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
            <span>%10</span>
            <span>%30</span>
            <span>%50</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-10 md:pt-14">
          <ResultCard 
            title={labels.monthlyRevenue} 
            value={monthlyRevenue} 
            icon={TrendingUp} 
            bgGradient="bg-gradient-to-br from-[#e50914]/20 to-[#b20710]/20"
            borderClass="border-primary/40 hover:border-pink-400"
            hoverShadow="hover:shadow-[0_0_30px_rgba(229,9,20,0.4)]"
            iconBg="bg-primary/30 text-primary group-hover:bg-primary group-hover:text-white"
            delay={0.1}
          />
          <ResultCard 
            title={labels.monthlyProfit} 
            value={monthlyProfit} 
            icon={DollarSign} 
            bgGradient="bg-gradient-to-br from-[#e50914]/20 to-[#b20710]/20"
            borderClass="border-[#e50914]/40 hover:border-[#e50914]"
            hoverShadow="hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            iconBg="bg-[#e50914]/30 text-[#e50914] group-hover:bg-[#e50914] group-hover:text-white"
            delay={0.2}
          />
          <div className="md:col-span-2">
            <ResultCard 
              title={labels.annualProfit} 
              value={annualProfit} 
              icon={Calendar} 
              bgGradient="bg-gradient-to-br from-[#e50914]/20 to-[#b20710]/20"
              borderClass="border-blue-500/40 hover:border-[#e50914]"
              hoverShadow="hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
              iconBg="bg-[#141414]/30 text-blue-300 group-hover:bg-[#141414] group-hover:text-white"
              delay={0.3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsCalculator;
