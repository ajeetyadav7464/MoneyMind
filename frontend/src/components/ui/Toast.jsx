/* components/ui/Toast.jsx */
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: { bg: 'rgba(74,222,146,0.1)', border: 'rgba(74,222,146,0.3)', icon: '✓', color: 'var(--green)' },
    error:   { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', icon: '✕', color: 'var(--red)' },
  };
  const c = colors[type] || colors.success;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      style={{
        position: 'fixed', top: 20, right: 20, zIndex: 9999,
        background: c.bg, border: `1px solid ${c.border}`,
        borderRadius: 12, padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        minWidth: 240, maxWidth: 340,
      }}
    >
      <span style={{ color: c.color, fontWeight: 700, fontSize: 15 }}>{c.icon}</span>
      <span style={{ color: 'var(--text)', fontSize: 13, flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 16 }}>×</button>
    </motion.div>
  );
}
