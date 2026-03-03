
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
      whileHover={{ scale: 1.05 }}
      className={`relative overflow-hidden group p-6 rounded-2xl border-2 transition-all duration-300 ${bgGradient} ${borderClass} ${hoverShadow}`}
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
    <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-slate-700/50 rounded-3xl p-6 md:p-10 shadow-2xl">
      <div className="space-y-10">
        {/* User Count Slider */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-slate-200 font-bold text-lg">
              <Users className="w-5 h-5 text-purple-400" />
              {labels.userCount}
            </label>
            <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 px-4 py-1.5 rounded-full font-mono text-lg font-black border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              {users}
            </span>
          </div>
          <Slider
            value={[users]}
            onValueChange={(val) => setUsers(val[0])}
            max={500}
            step={10}
            className="py-4"
          />
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
            <span>{labels.userCount0}</span>
            <span>{labels.userCount250}</span>
            <span>{labels.userCount500}</span>
          </div>
        </div>

        {/* Average Price Slider */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-slate-200 font-bold text-lg">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              {labels.avgPrice}
            </label>
            <span className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-200 px-4 py-1.5 rounded-full font-mono text-lg font-black border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {formatCurrency(avgPrice)}
            </span>
          </div>
          <Slider
            value={[avgPrice]}
            onValueChange={(val) => setAvgPrice(val[0])}
            min={minPrice}
            max={maxPrice}
            step={stepPrice}
            className="py-4"
          />
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
            <span>{priceMarks[0]}</span>
            <span>{priceMarks[1]}</span>
            <span>{priceMarks[2]}</span>
          </div>
        </div>

        {/* Commission Rate Slider */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-slate-200 font-bold text-lg">
              <PieChart className="w-5 h-5 text-blue-400" />
              {labels.commission}
            </label>
            <span className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 px-4 py-1.5 rounded-full font-mono text-lg font-black border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              %{commission}
            </span>
          </div>
          <Slider
            value={[commission]}
            onValueChange={(val) => setCommission(val[0])}
            min={10}
            max={50}
            step={5}
            className="py-4"
          />
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
            <span>%10</span>
            <span>%30</span>
            <span>%50</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <ResultCard 
            title={labels.monthlyRevenue} 
            value={monthlyRevenue} 
            icon={TrendingUp} 
            bgGradient="bg-gradient-to-br from-purple-500/20 to-pink-500/20"
            borderClass="border-purple-500/40 hover:border-pink-400"
            hoverShadow="hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            iconBg="bg-purple-500/30 text-purple-300 group-hover:bg-purple-500 group-hover:text-white"
            delay={0.1}
          />
          <ResultCard 
            title={labels.monthlyProfit} 
            value={monthlyProfit} 
            icon={DollarSign} 
            bgGradient="bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
            borderClass="border-emerald-500/40 hover:border-teal-400"
            hoverShadow="hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            iconBg="bg-emerald-500/30 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white"
            delay={0.2}
          />
          <div className="md:col-span-2">
            <ResultCard 
              title={labels.annualProfit} 
              value={annualProfit} 
              icon={Calendar} 
              bgGradient="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
              borderClass="border-blue-500/40 hover:border-cyan-400"
              hoverShadow="hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
              iconBg="bg-blue-500/30 text-blue-300 group-hover:bg-blue-500 group-hover:text-white"
              delay={0.3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsCalculator;
