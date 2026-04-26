import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import Layout from '../components/Layout';
import ExpenseModal from '../components/ExpenseModal';
import { formatMoney } from '../lib/money';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('date_desc');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const { data, isLoading, error } = useExpenses({
    ...(category ? { category } : {}),
    sort,
  });
  
  // Calculate total amount per currency
  const totalsByCurrency = data?.expenses?.reduce((acc, exp) => {
    const curr = exp.currency || 'INR';
    acc[curr] = (acc[curr] || 0) + parseFloat(exp.amount);
    return acc;
  }, {}) || {};

  const currencies = Object.keys(totalsByCurrency).length > 0 ? Object.keys(totalsByCurrency) : ['INR'];
  
  // Icon mapping for categories
  const categoryIcons = {
    Food: { icon: 'restaurant', color: 'text-tertiary', bg: 'bg-tertiary/10' },
    Transport: { icon: 'flight', color: 'text-secondary', bg: 'bg-secondary/10' },
    Shopping: { icon: 'shopping_bag', color: 'text-primary', bg: 'bg-primary/10' },
    Subscriptions: { icon: 'subscriptions', color: 'text-on-surface-variant', bg: 'bg-surface-bright' },
    default: { icon: 'receipt', color: 'text-stone-400', bg: 'bg-stone-800' }
  };

  return (
    <Layout>
      <main className="pt-28 px-6 max-w-5xl mx-auto space-y-12 pb-10">
        
        {/* Hero Summary Banner */}
        <section className="relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="glass-card glowing-primary rounded-[2.5rem] p-10 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
            <div className="space-y-4 z-10 flex flex-col items-start">
              <span className="font-sans uppercase tracking-[0.2em] text-[10px] font-bold text-on-surface-variant">Total Spend</span>
              <div className="flex flex-wrap gap-4 items-baseline">
                {currencies.map(curr => {
                  const amt = totalsByCurrency[curr] || 0;
                  const formatted = formatMoney(amt, curr);
                  const mainPart = formatted.replace(/\.\d+$/, '');
                  const decPart = formatted.match(/\.\d+$/)?.[0] || '.00';
                  return (
                    <h2 key={curr} className="font-serif text-5xl md:text-6xl font-black text-on-surface tracking-tighter">
                      {mainPart}<span className="text-primary/60 text-3xl">{decPart}</span>
                    </h2>
                  );
                })}
              </div>
            </div>
            
            {/* Abstract Texture BG */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <svg fill="none" height="200" viewBox="0 0 400 200" width="400" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 200C100 150 200 180 300 100C400 20 400 0 400 0V200H0Z" fill="url(#paint0_linear)"></path>
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="200" x2="200" y1="0" y2="200">
                    <stop stopColor="#ffc182"></stop>
                    <stop offset="1" stopColor="#121316"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </section>

        {/* Quick Actions Row */}
        <section className="grid grid-cols-3 gap-4 z-10 relative">
          <Link to="/add" className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-surface-container-high hover:-translate-y-1 transition-all group border border-outline-variant/10">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">add</span>
            </div>
            <span className="font-sans text-xs uppercase tracking-widest text-on-surface font-bold">New Entry</span>
          </Link>
          <Link to="/vault" className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-surface-container-high hover:-translate-y-1 transition-all group border border-outline-variant/10">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <span className="font-sans text-xs uppercase tracking-widest text-on-surface font-bold">The Vault</span>
          </Link>
          <Link to="/insights" className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-surface-container-high hover:-translate-y-1 transition-all group border border-outline-variant/10">
            <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <span className="font-sans text-xs uppercase tracking-widest text-on-surface font-bold">Insights</span>
          </Link>
        </section>

        {/* Filters & Controls */}
        <section className="flex flex-col md:flex-row gap-4 items-center justify-between z-10 relative">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none w-full bg-surface-container-low border border-outline-variant/10 rounded-full px-6 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none text-on-surface cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Utilities">Utilities</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-sm">expand_more</span>
            </div>
            <div className="relative flex-1 md:flex-none">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none w-full bg-surface-container-low border border-outline-variant/10 rounded-full px-6 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none text-on-surface cursor-pointer"
              >
                <option value="date_desc">Newest first</option>
                <option value="date_asc">Oldest first</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-sm">swap_vert</span>
            </div>
          </div>
        </section>

        {/* Recent Expenses Bento-style List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-serif text-2xl font-bold tracking-tight">Recent Ledger</h3>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-on-surface-variant font-sans">Loading ledger...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-400 font-sans">Failed to load expenses</div>
          ) : data?.expenses?.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-low rounded-3xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">receipt_long</span>
              <p className="text-on-surface-variant font-sans text-sm">No expenses found for this selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {data.expenses.map((expense, i) => {
                const conf = categoryIcons[expense.category] || categoryIcons.default;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    key={expense._id} 
                    onClick={() => setSelectedExpense(expense)}
                    className="group flex items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container-high transition-all rounded-3xl cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl ${conf.bg} flex items-center justify-center ${conf.color}`}>
                        <span className="material-symbols-outlined">{conf.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{expense.title}</h4>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {expense.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-lg font-bold">{formatMoney(expense.amount, expense.currency)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <ExpenseModal 
          isOpen={!!selectedExpense} 
          expense={selectedExpense} 
          onClose={() => setSelectedExpense(null)} 
        />
      )}
    </Layout>
  );
}
