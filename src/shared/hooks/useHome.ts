import { useQuery } from '@tanstack/react-query';
import * as homeService from '../api/homeService';

export function useHome() {
  return useQuery({
    queryKey: ['home'],
    queryFn: homeService.getHome,
    staleTime: 5 * 60 * 1000,
  });
}
