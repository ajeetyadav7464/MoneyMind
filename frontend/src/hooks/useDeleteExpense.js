import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteExpense } from '../api/expenses';

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}
