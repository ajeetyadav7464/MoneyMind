import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api/auth';

export function useMe(enabled = true) {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled,
    staleTime: 60_000,
  });
}
