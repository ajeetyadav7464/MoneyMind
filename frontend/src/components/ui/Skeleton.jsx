/* components/ui/Skeleton.jsx */
import { motion } from 'framer-motion';

export default function Skeleton({ width = '100%', height = 56, radius = 12 }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width, height,
        borderRadius: radius,
        background: 'linear-gradient(90deg, var(--bg2) 0%, var(--bg3) 50%, var(--bg2) 100%)',
        backgroundSize: '200% 100%',
      }}
    />
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={64} />
      ))}
    </div>
  );
}
