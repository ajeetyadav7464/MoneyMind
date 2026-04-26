import { motion, AnimatePresence } from 'framer-motion';
import { formatMoney } from '../lib/money';
import { useDeleteExpense } from '../hooks/useDeleteExpense';
import { useNavigate } from 'react-router-dom';

export default function ExpenseModal({ expense, isOpen, onClose }) {
  const { mutateAsync: deleteExpense, isPending: isDeleting } = useDeleteExpense();
  const navigate = useNavigate();

  if (!isOpen || !expense) return null;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this expense from your vault?')) {
      try {
        await deleteExpense(expense._id);
        onClose();
      } catch (e) {
        alert('Failed to delete expense');
      }
    }
  };

  const handleEdit = () => {
    onClose();
    navigate(`/expense/${expense._id}/edit`, { state: { expense } });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        ></motion.div>

        {/* Modal Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          whileHover={{ boxShadow: '0 0 0 1px rgba(240,160,71,0.24), 0 40px 80px rgba(0,0,0,0.62)' }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-8 w-full max-w-md rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative z-10 border border-outline-variant/20"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant/10">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-on-surface leading-tight">{expense.category}</h3>
                <p className="text-xs text-on-surface-variant">
                  {new Date(expense.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Amount */}
          <div className="text-center mb-8 py-6 bg-surface-container-low rounded-2xl border border-outline-variant/5">
            <p className="font-sans uppercase text-[10px] tracking-[0.2em] text-primary mb-1">Outflow</p>
            <h2 className="font-serif text-5xl font-bold text-on-surface tracking-tighter">
              {formatMoney(expense.amount, expense.currency)}
            </h2>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-8">
            <div>
              <p className="font-sans uppercase text-[10px] tracking-widest text-on-surface-variant mb-1">Title</p>
              <p className="font-sans text-sm text-on-surface">{expense.title}</p>
            </div>
            {expense.description && (
              <div>
                <p className="font-sans uppercase text-[10px] tracking-widest text-on-surface-variant mb-1">Context</p>
                <p className="font-sans text-sm text-on-surface/80">{expense.description}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 border-t border-outline-variant/10 pt-6">
            <button 
              onClick={handleEdit}
              className="flex-1 py-3 bg-surface-container-high hover:bg-surface-bright rounded-full text-on-surface font-sans text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 border border-outline-variant/10 hover:shadow-[0_0_0_1px_rgba(240,160,71,0.34),0_12px_24px_rgba(240,160,71,0.16)]"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 border border-red-500/20 disabled:opacity-50 hover:shadow-[0_0_0_1px_rgba(248,113,113,0.34),0_12px_24px_rgba(248,113,113,0.16)]"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
