/**
 * animations/variants.js
 * Reusable Framer Motion variants — import these instead of inline objects.
 */

export const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export const cardReveal = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1 },
  exit:    { opacity: 0, x: -20, scale: 0.97 },
};

export const slideInRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: 40 },
};

export const shakeX = {
  animate: {
    x: [0, -8, 8, -6, 6, -4, 4, 0],
    transition: { duration: 0.45 },
  },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: 0.92 },
};
