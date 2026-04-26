import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../lib/validators';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const { register: registerAction } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setAuthError(null);
      await registerAction(data);
      navigate('/');
    } catch (err) {
      setAuthError(err.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 stone-texture overflow-hidden relative">
      <div className="absolute inset-0 glow-radial pointer-events-none"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <main className="w-full max-w-md z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <span className="font-serif italic text-5xl text-primary-container tracking-tighter">Fenmo</span>
          </div>
          <p className="font-sans uppercase text-[10px] tracking-[0.3em] text-on-surface-variant/60 font-medium">Join the Collection</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <header className="mb-8">
            <h1 className="font-serif text-3xl text-on-surface font-light leading-tight">Create your <span className="italic">vault</span>.</h1>
          </header>

          <AnimatePresence>
            {authError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-6 text-center">
                {authError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative group">
              <label className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block transition-colors group-focus-within:text-primary">Full Name</label>
              <div className="relative">
                <input {...register('name')} className="w-full bg-surface-container-highest/40 border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 transition-all outline-none" placeholder="Isabella Rossi" type="text" />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg">person</span>
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1 absolute">{errors.name.message}</p>}
            </div>

            <div className="relative group">
              <label className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block transition-colors group-focus-within:text-primary">Email Address</label>
              <div className="relative">
                <input {...register('email')} className="w-full bg-surface-container-highest/40 border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 transition-all outline-none" placeholder="curator@atelier.com" type="email" />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg">alternate_email</span>
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 absolute">{errors.email.message}</p>}
            </div>

            <div className="relative group pb-4">
              <label className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block transition-colors group-focus-within:text-primary">Secret Key</label>
              <div className="relative">
                <input {...register('password')} className="w-full bg-surface-container-highest/40 border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 transition-all outline-none" placeholder="••••••••••••" type="password" />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg">lock</span>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 absolute">{errors.password.message}</p>}
            </div>

            <div className="pt-2">
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-full shadow-[0_10px_30px_rgba(240,160,71,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:scale-100">
                {isSubmitting ? 'Creating Vault...' : 'Initialize'}
              </button>
            </div>
          </form>

          <footer className="mt-8 text-center">
            <p className="font-sans text-sm text-on-surface-variant/60">
              Already a patron? 
              <Link to="/login" className="text-primary font-medium hover:underline underline-offset-4 decoration-primary/30 transition-all ml-1">Login</Link>
            </p>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
