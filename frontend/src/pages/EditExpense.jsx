import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, CATEGORIES, CURRENCIES } from '../lib/validators';
import { useUpdateExpense } from '../hooks/useUpdateExpense';
import { useExpenseById } from '../hooks/useExpenseById';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: updateExpense } = useUpdateExpense();

  // Retrieve the existing expense data passed from the Vault or Dashboard modal
  const existingExpense = location.state?.expense;
  const { data: fetchedExpense, isLoading: isLoadingExpense } = useExpenseById(id, !existingExpense);
  const expenseData = existingExpense || fetchedExpense;

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(expenseSchema),
    values: expenseData ? {
      title: expenseData.title,
      amount: String(expenseData.amount?.$numberDecimal ?? expenseData.amount ?? ''),
      currency: expenseData.currency || 'INR',
      category: expenseData.category,
      date: new Date(expenseData.date).toISOString().split('T')[0],
      description: expenseData.description || '',
    } : {}
  });

  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const selectedCurrency = watch('currency') || 'INR';

  if (isLoadingExpense && !existingExpense) {
    return (
      <Layout>
        <div className="pt-32 text-center text-on-surface-variant">Loading expense details...</div>
      </Layout>
    );
  }

  if (!expenseData) {
    return (
      <Layout>
        <div className="pt-32 text-center text-on-surface-variant">Expense data not found.</div>
      </Layout>
    );
  }

  const onSubmit = async (data) => {
    try {
      await updateExpense({ id, data });
      navigate('/vault');
    } catch (err) {
      alert(err.message || 'Failed to update expense');
    }
  };

  return (
    <Layout>
      <main className="pt-24 px-6 max-w-2xl mx-auto pb-10 relative">
        <div className="fixed top-1/4 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        {/* Editorial Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center md:text-left">
          <p className="font-sans uppercase text-[10px] tracking-[0.2em] text-primary mb-2">Modify Ledger</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-on-surface">Update <span className="italic text-primary">Atelier</span> Entry</h2>
          <div className="h-1 w-12 bg-primary-container mt-4 rounded-full mx-auto md:mx-0 opacity-50"></div>
        </motion.div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-[2rem] p-8 premium-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl">payments</span>
            </div>
            <label className="font-sans uppercase text-[10px] tracking-widest font-medium text-on-surface-variant block mb-4">Amount & Currency</label>
            <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="relative w-full">
                <span className="absolute left-0 bottom-3 font-serif text-3xl text-primary/50">{currencySymbols[selectedCurrency]}</span>
                <input 
                  {...register('amount')}
                  className="w-full bg-transparent border-b border-outline-variant/30 py-3 pl-8 text-5xl font-serif text-on-surface placeholder:text-surface-variant focus:border-primary transition-all" 
                  step="0.01" type="number" 
                />
              </div>
              <div className="flex bg-surface-container-high p-1 rounded-full border border-outline-variant/10 relative">
                <select 
                  {...register('currency')}
                  className="px-4 py-2 pr-8 rounded-full bg-primary-container text-on-primary-container font-sans text-xs font-bold transition-all appearance-none outline-none cursor-pointer"
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-primary-container pointer-events-none text-sm">expand_more</span>
              </div>
            </div>
            {errors.amount && <p className="text-red-400 text-xs mt-2">{errors.amount.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 glass-card rounded-xl p-6 transition-all hover:bg-surface-container-high/40">
              <label className="font-sans uppercase text-[10px] tracking-widest font-medium text-on-surface-variant block mb-2">Expense Title</label>
              <input 
                {...register('title')}
                className="w-full bg-transparent border-none p-0 text-xl font-sans text-on-surface placeholder:text-surface-variant focus:ring-0" 
                type="text" 
              />
              {errors.title && <p className="text-red-400 text-xs mt-2">{errors.title.message}</p>}
            </div>

            <div className="glass-card rounded-xl p-6 transition-all hover:bg-surface-container-high/40 relative">
              <label className="font-sans uppercase text-[10px] tracking-widest font-medium text-on-surface-variant block mb-2">Category</label>
              <select {...register('category')} className="w-full bg-transparent border-none p-0 text-lg font-sans text-on-surface appearance-none focus:ring-0 cursor-pointer relative z-10">
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-surface-container text-on-surface">{cat}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-6 bottom-6 text-primary pointer-events-none z-0">expand_more</span>
              {errors.category && <p className="text-red-400 text-xs mt-2">{errors.category.message}</p>}
            </div>

            <div className="glass-card rounded-xl p-6 transition-all hover:bg-surface-container-high/40 relative">
              <label className="font-sans uppercase text-[10px] tracking-widest font-medium text-on-surface-variant block mb-2">Date</label>
              <input 
                {...register('date')}
                className="w-full bg-transparent border-none p-0 text-lg font-sans text-on-surface focus:ring-0 cursor-pointer [color-scheme:dark] relative z-10" 
                type="date" 
              />
              <span className="material-symbols-outlined absolute right-6 bottom-6 text-primary pointer-events-none z-0">calendar_today</span>
              {errors.date && <p className="text-red-400 text-xs mt-2">{errors.date.message}</p>}
            </div>

            <div className="md:col-span-2 glass-card rounded-xl p-6 transition-all hover:bg-surface-container-high/40">
              <label className="font-sans uppercase text-[10px] tracking-widest font-medium text-on-surface-variant block mb-2">Description</label>
              <textarea 
                {...register('description')}
                className="w-full bg-transparent border-none p-0 text-base font-sans text-on-surface placeholder:text-surface-variant focus:ring-0 resize-none" 
                rows="3"
              ></textarea>
              {errors.description && <p className="text-red-400 text-xs mt-2">{errors.description.message}</p>}
            </div>
          </motion.div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="w-1/3 py-5 rounded-full bg-surface-container text-on-surface font-sans font-bold text-sm hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={isSubmitting}
              type="submit" 
              className="w-2/3 py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-sans font-bold text-sm glow-button hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:scale-100"
            >
              {isSubmitting ? 'Updating...' : 'Confirm Changes'}
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
}
