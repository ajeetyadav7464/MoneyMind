/**
 * hooks/useIdempotencyKey.js
 * Generates a UUID v4 per form open. Regenerates after successful submit.
 * Ensures that even if the user submits twice (network retry / double-click),
 * the backend only creates one expense.
 */

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useIdempotencyKey() {
  const [key, setKey] = useState(uuidv4);

  const refresh = useCallback(() => setKey(uuidv4()), []);

  return { key, refresh };
}
