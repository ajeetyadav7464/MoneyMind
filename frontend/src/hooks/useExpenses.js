/**
 * hooks/useExpenses.js
 * useQuery wrapper for fetching the expense list.
 */

import { useQuery } from '@tanstack/react-query';
import { getExpenses } from '../api/expenses';

export function useExpenses(params = {}) {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn:  () => getExpenses(params),
    staleTime: 30_000,
    select: (data) => ({
      expenses: data.expenses ?? [],
      total:    data.total ?? 0,
      pages:    data.pages ?? data.totalPages ?? 1,
      totalPages: data.pages ?? data.totalPages ?? 1,
    }),
  });
}
