/* components/ui/Modal.jsx */
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn } from '../../animations/variants';
import { smooth } from '../../animations/transitions';

export default function Modal({ open, onClose, title, children }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={smooth}
            whileHover={{ boxShadow: '0 0 0 1px rgba(240,160,71,0.32), 0 24px 80px rgba(0,0,0,0.6)' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border-bright)',
              borderRadius: 20,
              padding: 28,
              width: '100%',
              maxWidth: 480,
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, fontWeight: 400, color: 'var(--text)' }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'none', border: '1px solid var(--border-bright)',
                  borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
                  color: 'var(--muted)', fontSize: 16, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
