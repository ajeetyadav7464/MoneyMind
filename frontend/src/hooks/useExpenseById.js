import { useQuery } from '@tanstack/react-query';
import { getExpenseById } from '../api/expenses';

export function useExpenseById(id, enabled = true) {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: () => getExpenseById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 30_000,
  });
}
