/* components/ui/Input.jsx */
import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Input = forwardRef(function Input({ label, error, prefix, type = 'text', ...props }, ref) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{
          fontSize: 12,
          color: focused ? 'var(--accent)' : 'var(--muted)',
          fontWeight: 500,
          transition: 'color 0.2s',
          letterSpacing: '0.03em',
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span style={{
            position: 'absolute', left: 12,
            color: 'var(--muted)', fontSize: 14, pointerEvents: 'none',
          }}>{prefix}</span>
        )}
        <motion.input
          ref={ref}
          type={type}
          animate={error ? { x: [0, -6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.35 }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            background: 'var(--bg3)',
            border: `1px solid ${error ? 'var(--red)' : focused ? 'var(--accent)' : 'var(--border-bright)'}`,
            borderRadius: 10,
            padding: `10px 14px 10px ${prefix ? '28px' : '14px'}`,
            color: 'var(--text)',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'Outfit, sans-serif',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focused ? '0 0 0 3px rgba(240,160,71,0.1)' : 'none',
          }}
          {...props}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ fontSize: 11, color: 'var(--red)', marginTop: 2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Input;
