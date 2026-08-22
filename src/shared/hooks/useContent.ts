import { useQuery } from '@tanstack/react-query';
import * as otherServices from '../api/otherServices';

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: otherServices.getJobs,
    staleTime: 5 * 60 * 1000,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => otherServices.getJob(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: otherServices.getEvents,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStories() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: otherServices.getStories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: otherServices.getArticles,
    staleTime: 5 * 60 * 1000,
  });
}

export function useContact() {
  return useQuery({
    queryKey: ['contact'],
    queryFn: otherServices.getContact,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTeam() {
  return useQuery({
    queryKey: ['team'],
    queryFn: otherServices.getTeam,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: otherServices.getPartners,
    staleTime: 5 * 60 * 1000,
  });
}
