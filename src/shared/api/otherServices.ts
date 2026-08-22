import apiClient from './client';
import type { ApiResponse, Job, Article, Story, Event, Category, TeamEmployee, Partner } from './types';

export async function getJobs() {
  const res = await apiClient.get<ApiResponse<{
    ranges: any[];
    categories: Category[];
    cities: any[];
    jobs: Job[];
  }>>('/jobs');
  return res.data.data;
}

export async function getJob(id: string) {
  const res = await apiClient.get<ApiResponse<{
    ranges: any[];
    categories: Category[];
    cities: any[];
    jobs: Job;
    news: Article[];
  }>>(`/jobs/${id}`);
  return res.data.data;
}

export async function getEvents() {
  const res = await apiClient.get<ApiResponse<{
    seo: Record<string, any>;
    categories: Category[];
    events: Event[];
    news: Article[];
  }>>('/events');
  return res.data.data;
}

export async function getStories() {
  const res = await apiClient.get<ApiResponse<{
    stories: Story[];
    categories: Category[];
  }>>('/stories');
  return res.data.data;
}

export async function getArticles() {
  const res = await apiClient.get<ApiResponse<{
    categories: Category[];
    articles: Article[];
  }>>('/content/articles');
  return res.data.data;
}

export async function getContact() {
  const res = await apiClient.get<ApiResponse<{
    categories: Category[];
    employee: any[];
    city: any[];
    offices: any[];
    companies: any[];
  }>>('/contact');
  return res.data.data;
}

export async function getTeam() {
  const res = await apiClient.get<ApiResponse<{
    categories: Category[];
    employee: TeamEmployee[];
  }>>('/team');
  return res.data.data;
}

export async function getPartners() {
  const res = await apiClient.get<ApiResponse<{
    categories: Category[];
    partners: Partner[];
  }>>('/info/partners');
  return res.data.data;
}
