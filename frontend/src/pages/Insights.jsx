import { useSummary } from '../hooks/useSummary';
import { useExpenses } from '../hooks/useExpenses';
import Layout from '../components/Layout';
import { formatMoney } from '../lib/money';
import { CURRENCIES } from '../lib/validators';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Insights() {
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const { data: summaryData, isLoading: summaryLoading } = useSummary();
  const categories = summaryData || [];
  
  // Filter categories by selected currency
  const filteredCategories = categories.filter(c => c.currency === selectedCurrency);
  
  // Calculate total for the selected currency
  const totalAmount = filteredCategories.reduce((sum, cat) => sum + parseFloat(cat.total), 0);
  
  // Find highest category for calculation within the selected currency
  const maxCategoryTotal = filteredCategories.length > 0 
    ? Math.max(...filteredCategories.map(c => parseFloat(c.total))) 
    : 1;

  const categoryColors = {
    Food: 'bg-primary',
    Transport: 'bg-secondary',
    Shopping: 'bg-tertiary',
    Entertainment: 'bg-pink-400',
    Health: 'bg-green-400',
    Utilities: 'bg-blue-400',
    Education: 'bg-purple-400',
    Other: 'bg-gray-400'
  };

  return (
    <Layout>
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-10 space-y-12 relative">
        {/* Abstract Glow Background */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        {/* Hero Section: Total Spending */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-sans uppercase text-[10px] tracking-[0.2em] text-on-surface-variant font-semibold">Total Outflow</span>
                <select 
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-surface-container-high border border-outline-variant/10 rounded-full px-3 py-1 text-[10px] font-bold text-primary cursor-pointer outline-none focus:ring-1 focus:ring-primary/40"
                >
                  {CURRENCIES.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                </select>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-on-surface leading-none">
                {formatMoney(totalAmount, selectedCurrency).replace(/\.\d+$/, '')}
                <span className="text-primary/40 text-3xl font-normal">
                  {formatMoney(totalAmount, selectedCurrency).match(/\.\d+$/)?.[0] || '.00'}
                </span>
              </h2>
            </div>
            <div className="bg-surface-container-high/60 backdrop-blur-xl p-4 rounded-xl border border-outline-variant/10 flex items-center gap-4">
              <div className="flex flex-col">
                <span className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant">Efficiency</span>
                <span className="text-primary font-bold text-xl">Active</span>
              </div>
              <div className="w-16 h-8 flex items-end gap-1">
                <div className="w-2 h-3 bg-primary/20 rounded-t-sm"></div>
                <div className="w-2 h-5 bg-primary/40 rounded-t-sm"></div>
                <div className="w-2 h-7 bg-primary/60 rounded-t-sm"></div>
                <div className="w-2 h-8 bg-primary rounded-t-sm"></div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Bento Grid Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          
          {/* Category Breakdown */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 bg-surface-container rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden relative border border-outline-variant/5">
            <div className="relative z-10">
              <h3 className="font-serif text-2xl mb-8">Category Allocation</h3>
              
              {summaryLoading ? (
                <p className="text-on-surface-variant text-sm">Calculating allocations...</p>
              ) : filteredCategories.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No expenses found for {selectedCurrency}.</p>
              ) : (
                <div className="space-y-6">
                  {filteredCategories.map((cat, i) => {
                    const amount = parseFloat(cat.total);
                    const percentage = Math.max(5, (amount / maxCategoryTotal) * 100);
                    const colorClass = categoryColors[cat.category] || 'bg-primary/50';
                    
                    return (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i * 0.1) }} key={cat.category} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="font-sans font-medium text-sm">{cat.category}</span>
                          <span className="font-sans text-on-surface-variant text-xs">{formatMoney(amount, selectedCurrency)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${percentage}%` }} 
                            transition={{ duration: 1, delay: 0.3 + (i * 0.1) }}
                            className={`h-full ${colorClass} rounded-full`}
                          ></motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Side Card: Spending Pulse */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-surface-container-high rounded-[2rem] p-8 flex flex-col justify-between border border-outline-variant/5">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined">insights</span>
              </div>
              <h3 className="font-serif text-xl leading-tight">Spending Pulse</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {filteredCategories.length > 0 ? `Most of your ${selectedCurrency} budget is allocated to ${filteredCategories[0]?.category}.` : `Start recording expenses in ${selectedCurrency} to unlock deeper insights into your financial habits.`}
              </p>
            </div>
          </motion.div>
        </div>

      </main>
    </Layout>
  );
}
