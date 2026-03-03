
import React, { useState } from 'react';
import EarningsCalculator from './EarningsCalculator';
import PackagePresets from './PackagePresets';
import { motion } from 'framer-motion';
import { Rocket, Zap, Crown, Gem } from 'lucide-react';

const dePresets = [
  {
    id: 'beginner',
    title: 'Anfänger',
    desc: 'Ideal für Einsteiger',
    icon: Rocket,
    color: 'blue',
    users: 50,
    price: 80,
    rate: 25,
    stats: '50 Kunden, 25% Provision'
  },
  {
    id: 'growth',
    title: 'Wachstum',
    desc: 'Für schnell wachsende Reseller',
    icon: Zap,
    color: 'purple',
    users: 150,
    price: 80,
    rate: 30,
    stats: '150 Kunden, 30% Provision'
  },
  {
    id: 'pro',
    title: 'Professionell',
    desc: 'Hohes Verkaufsvolumen',
    icon: Crown,
    color: 'pink',
    users: 300,
    price: 80,
    rate: 35,
    stats: '300 Kunden, 35% Provision'
  },
  {
    id: 'elite',
    title: 'Elite',
    desc: 'Maximales Einkommensziel',
    icon: Gem,
    color: 'orange',
    users: 500,
    price: 80,
    rate: 40,
    stats: '500 Kunden, 40% Provision'
  }
];

const ResellerCalculatorSectionDE = () => {
  const [users, setUsers] = useState(50);
  const [avgPrice, setAvgPrice] = useState(80);
  const [commission, setCommission] = useState(40);

  const handlePresetSelect = (preset) => {
    setUsers(preset.users);
    setAvgPrice(preset.price);
    setCommission(preset.rate);
  };

  const calculatorLabels = {
    userCount: "Benutzeranzahl",
    userCount0: "0 Benutzer",
    userCount250: "250 Benutzer",
    userCount500: "500+ Benutzer",
    avgPrice: "Durchschnittlicher Paketpreis",
    commission: "Provisionsquote",
    monthlyRevenue: "Monatlicher Umsatz",
    monthlyProfit: "Monatlicher Gewinn",
    annualProfit: "Jährlicher Nettogewinn"
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
        </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-black mb-4 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Einkommensrechner
            </span>
          </h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Berechnen Sie, wie viel Sie verdienen können. Durch Anpassung von Benutzeranzahl, Paketpreis und Provisionsquote können Sie Ihr monatliches und jährliches Einkommenspotenzial ermitteln.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Calculator */}
          <div className="lg:col-span-7">
            <EarningsCalculator 
              users={users} 
              setUsers={setUsers}
              avgPrice={avgPrice}
              setAvgPrice={setAvgPrice}
              commission={commission}
              setCommission={setCommission}
              labels={calculatorLabels}
              locale="de-DE"
              currencyCode="EUR"
              minPrice={20}
              maxPrice={200}
              stepPrice={5}
              priceMarks={["20 €", "110 €", "200+ €"]}
            />
          </div>

          {/* Right Column: Presets */}
          <div className="lg:col-span-5">
            <PackagePresets 
              onSelectPreset={handlePresetSelect}
              currentValues={{ users, avgPrice, commission }}
              title="Schnelle Szenarien"
              presets={dePresets}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResellerCalculatorSectionDE;
