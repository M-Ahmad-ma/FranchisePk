import { useQuery } from '@tanstack/react-query';
import * as propertyService from '../api/propertyService';

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: propertyService.getProperties,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getProperty(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
