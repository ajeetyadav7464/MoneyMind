import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../lib/validators';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setAuthError(null);
      await login(data);
      navigate('/');
    } catch (err) {
      setAuthError(err.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 stone-texture overflow-hidden relative">
      {/* Ambient Glow Sources */}
      <div className="absolute inset-0 glow-radial pointer-events-none"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Login Canvas */}
      <main className="w-full max-w-md z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-12"
        >
          {/* Brand Anchor */}
          <div className="mb-4">
            <span className="font-serif italic text-5xl text-primary-container tracking-tighter">Fenmo</span>
          </div>
          <p className="font-sans uppercase text-[10px] tracking-[0.3em] text-on-surface-variant/60 font-medium">The Private Atelier of Finance</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="glass-panel p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative"
        >
          <header className="mb-10">
            <h1 className="font-serif text-3xl text-on-surface font-light leading-tight">Welcome back to the <span className="italic">sanctum</span>.</h1>
          </header>

          <AnimatePresence>
            {authError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-6 text-center"
              >
                {authError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Email Field */}
            <div className="relative group">
              <label className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block transition-colors group-focus-within:text-primary">Email Address</label>
              <div className="relative">
                <input 
                  {...register('email')}
                  className="w-full bg-surface-container-highest/40 border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 transition-all outline-none" 
                  placeholder="curator@atelier.com" type="email" 
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg">alternate_email</span>
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 absolute">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="flex justify-between items-center mb-2">
                <label className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant transition-colors group-focus-within:text-primary">Secret Key</label>
              </div>
              <div className="relative">
                <input 
                  {...register('password')}
                  className="w-full bg-surface-container-highest/40 border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 transition-all outline-none" 
                  placeholder="••••••••••••" type="password" 
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg">lock</span>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 absolute">{errors.password.message}</p>}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-full shadow-[0_10px_30px_rgba(240,160,71,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:scale-100"
              >
                {isSubmitting ? 'Authenticating...' : 'Enter the Atelier'}
              </button>
            </div>
          </form>

          <footer className="mt-10 text-center">
            <p className="font-sans text-sm text-on-surface-variant/60">
              New to our collection? 
              <Link to="/register" className="text-primary font-medium hover:underline underline-offset-4 decoration-primary/30 transition-all ml-1">Register</Link>
            </p>
          </footer>
        </motion.div>

        {/* Secondary Decoration */}
        <div className="mt-12 flex justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            <span className="font-sans text-[9px] uppercase tracking-widest">Vault Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px]">history_edu</span>
            <span className="font-sans text-[9px] uppercase tracking-widest">Heritage Grade</span>
          </div>
        </div>
      </main>

      {/* Decorative Corner Elements */}
      <div className="hidden lg:block absolute bottom-12 right-12 text-right pointer-events-none">
        <p className="font-serif italic text-on-surface-variant/20 text-6xl leading-none">Perspective<br/>is the finest<br/>currency.</p>
      </div>
    </div>
  );
}
