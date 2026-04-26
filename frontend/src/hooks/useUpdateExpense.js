import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateExpense } from '../api/expenses';

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}
