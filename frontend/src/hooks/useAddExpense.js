/**
 * hooks/useAddExpense.js
 * useMutation for creating an expense with an idempotency key.
 * Automatically invalidates the expenses query cache on success.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExpense } from '../api/expenses';

export function useAddExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, idempotencyKey }) => createExpense(data, idempotencyKey),
    onSuccess: () => {
      // Invalidate all expense queries so the list refreshes
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}
