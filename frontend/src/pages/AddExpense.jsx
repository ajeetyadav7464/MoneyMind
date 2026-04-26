import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, CATEGORIES, CURRENCIES } from '../lib/validators';
import { useAddExpense } from '../hooks/useAddExpense';
import { useIdempotencyKey } from '../hooks/useIdempotencyKey';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

export default function AddExpense() {
  const navigate = useNavigate();
  const { mutateAsync: addExpense } = useAddExpense();
  const { key: idempotencyKey, refresh } = useIdempotencyKey();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: { date: new Date().toISOString().split('T')[0], currency: 'INR' }
  });

  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const selectedCurrency = watch('currency') || 'INR';

  const onSubmit = async (data) => {
    try {
      await addExpense({ data, idempotencyKey });
      refresh();
      navigate('/');
    } catch (err) {
      alert(err.message || 'Failed to add expense');
    }
  };

  return (
    <Layout>
      <main className="pt-24 px-6 max-w-2xl mx-auto pb-10 relative">
        <div className="fixed top-1/4 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="fixed bottom-1/4 -right-24 w-96 h-96 bg-tertiary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        {/* Editorial Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center md:text-left">
          <p className="font-sans uppercase text-[10px] tracking-[0.2em] text-primary mb-2">New Entry</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-on-surface">Record an <span className="italic text-primary">Atelier</span> Expense</h2>
          <div className="h-1 w-12 bg-primary-container mt-4 rounded-full mx-auto md:mx-0 opacity-50"></div>
        </motion.div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Amount Hero Field */}
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
                  placeholder="0.00" step="0.01" type="number" 
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

          {/* Details Section - Asymmetric Bento Layout */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title Field */}
            <div className="md:col-span-2 glass-card rounded-xl p-6 transition-all hover:bg-surface-container-high/40">
              <label className="font-sans uppercase text-[10px] tracking-widest font-medium text-on-surface-variant block mb-2">Expense Title</label>
              <input 
                {...register('title')}
                className="w-full bg-transparent border-none p-0 text-xl font-sans text-on-surface placeholder:text-surface-variant focus:ring-0" 
                placeholder="e.g. Dinner at The Gilded Lily" type="text" 
              />
              {errors.title && <p className="text-red-400 text-xs mt-2">{errors.title.message}</p>}
            </div>

            {/* Category Dropdown */}
            <div className="glass-card rounded-xl p-6 transition-all hover:bg-surface-container-high/40 relative">
              <label className="font-sans uppercase text-[10px] tracking-widest font-medium text-on-surface-variant block mb-2">Category</label>
              <select {...register('category')} className="w-full bg-transparent border-none p-0 text-lg font-sans text-on-surface appearance-none focus:ring-0 cursor-pointer relative z-10">
                <option value="" className="bg-surface-container text-on-surface">Select Category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-surface-container text-on-surface">{cat}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-6 bottom-6 text-primary pointer-events-none z-0">expand_more</span>
              {errors.category && <p className="text-red-400 text-xs mt-2">{errors.category.message}</p>}
            </div>

            {/* Date Picker */}
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

            {/* Description */}
            <div className="md:col-span-2 glass-card rounded-xl p-6 transition-all hover:bg-surface-container-high/40">
              <label className="font-sans uppercase text-[10px] tracking-widest font-medium text-on-surface-variant block mb-2">Description</label>
              <textarea 
                {...register('description')}
                className="w-full bg-transparent border-none p-0 text-base font-sans text-on-surface placeholder:text-surface-variant focus:ring-0 resize-none" 
                placeholder="Add some context to this transaction..." rows="3"
              ></textarea>
              {errors.description && <p className="text-red-400 text-xs mt-2">{errors.description.message}</p>}
            </div>
          </motion.div>

          {/* Submit Action */}
          <div className="pt-4">
            <button 
              disabled={isSubmitting}
              type="submit" 
              className="w-full py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-sans font-bold text-lg glow-button hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
            >
              <span className="material-symbols-outlined">check_circle</span>
              {isSubmitting ? 'Saving...' : 'Save Expense'}
            </button>
            <p className="text-center mt-6 font-sans text-[10px] tracking-widest text-on-surface-variant/40 uppercase">Transactions are encrypted and stored in your vault</p>
          </div>
        </form>
      </main>
    </Layout>
  );
}
