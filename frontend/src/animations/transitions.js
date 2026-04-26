/**
 * animations/transitions.js
 * Shared spring / tween configs — consistent motion feel across the app.
 */

export const snappy  = { type: 'spring', stiffness: 400, damping: 30 };
export const smooth  = { type: 'spring', stiffness: 120, damping: 20 };
export const bouncy  = { type: 'spring', stiffness: 300, damping: 15 };
export const linear  = { type: 'tween',  duration: 0.2, ease: 'easeOut' };
