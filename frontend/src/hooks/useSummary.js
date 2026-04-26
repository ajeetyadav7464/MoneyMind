import { useQuery } from '@tanstack/react-query';
import { getSummary } from '../api/expenses';

export function useSummary() {
  return useQuery({
    queryKey: ['summary'],
    queryFn: () => getSummary(),
    staleTime: 60_000,
  });
}
