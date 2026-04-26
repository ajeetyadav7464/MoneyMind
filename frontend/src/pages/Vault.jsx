import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import Layout from '../components/Layout';
import ExpenseModal from '../components/ExpenseModal';
import { formatMoney } from '../lib/money';
import { motion } from 'framer-motion';

export default function Vault() {
  // We'll use the Vault to show ALL expenses by pulling a large limit or allowing pagination
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { data, isLoading, error } = useExpenses({ 
    page, 
    limit: 50, 
    ...(selectedCategory ? { category: selectedCategory } : {}) 
  });
  
  const [selectedExpense, setSelectedExpense] = useState(null);

  const categoryIcons = {
    Food: { icon: 'restaurant', color: 'text-tertiary', bg: 'bg-tertiary/10' },
    Transport: { icon: 'flight', color: 'text-secondary', bg: 'bg-secondary/10' },
    Shopping: { icon: 'shopping_bag', color: 'text-primary', bg: 'bg-primary/10' },
    Subscriptions: { icon: 'subscriptions', color: 'text-on-surface-variant', bg: 'bg-surface-bright' },
    default: { icon: 'receipt', color: 'text-stone-400', bg: 'bg-stone-800' }
  };

  return (
    <Layout>
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-10 space-y-12 relative min-h-[80vh]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
              <h2 className="font-serif text-4xl text-on-surface">The Vault</h2>
            </div>
            <p className="font-sans text-on-surface-variant text-sm">Your comprehensive ledger history.</p>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <select 
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="bg-surface-container-high border border-outline-variant/10 rounded-full px-4 py-2 text-xs font-sans text-on-surface cursor-pointer focus:ring-1 focus:ring-primary/40 outline-none"
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
          </div>
        </div>

        {/* Ledger List */}
        <div className="glass-card rounded-[2rem] p-6 border border-outline-variant/10">
          {isLoading ? (
            <div className="text-center py-20 text-on-surface-variant">Decrypting vault records...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-400">Failed to access vault.</div>
          ) : data?.expenses?.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block">receipt_long</span>
              <p className="text-on-surface-variant text-sm">No records found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {data.expenses.map((expense, i) => {
                const conf = categoryIcons[expense.category] || categoryIcons.default;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    key={expense._id} 
                    onClick={() => setSelectedExpense(expense)}
                    className="group flex items-center justify-between p-4 bg-surface-container hover:bg-surface-container-high transition-all rounded-2xl cursor-pointer border border-transparent hover:border-outline-variant/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${conf.bg} flex items-center justify-center ${conf.color}`}>
                        <span className="material-symbols-outlined text-sm">{conf.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{expense.title}</h4>
                        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider mt-0.5">
                          {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <p className="font-serif text-base font-bold text-on-surface">{formatMoney(expense.amount, expense.currency)}</p>
                      <span className="material-symbols-outlined text-on-surface-variant/30 text-sm group-hover:text-primary transition-colors">chevron_right</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          
          {/* Pagination Controls */}
          {data?.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-outline-variant/10">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface disabled:opacity-30 hover:bg-surface-bright transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </button>
              <span className="font-sans text-xs text-on-surface-variant font-medium">Page {page} of {data.totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface disabled:opacity-30 hover:bg-surface-bright transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
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
