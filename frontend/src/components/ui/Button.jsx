/* components/ui/Button.jsx */
import { motion } from 'framer-motion';

const variants = {
  primary: {
    base: 'bg-accent text-bg font-semibold',
    hover: 'hover:brightness-110',
    style: { background: 'var(--accent)', color: 'var(--bg)' },
  },
  ghost: {
    base: 'border border-border-bright text-muted',
    hover: 'hover:text-text hover:border-accent',
    style: { borderColor: 'var(--border-bright)', color: 'var(--muted)' },
  },
  danger: {
    base: 'border border-red-500/30 text-red-400',
    style: { borderColor: 'rgba(248,113,113,0.3)', color: 'var(--red)' },
  },
};

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '10px',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        border: 'none',
        outline: 'none',
        transition: 'all 0.2s',
        ...variants[variant]?.style,
      }}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      )}
      {children}
    </motion.button>
  );
}
