import type { Category, Company } from '../api/types';
import { imageUrl } from '../api/imageUrl';

export interface FilterChip {
  id: string;
  label: string;
}

export const ALL_SECTORS = 'all';
export const INTERNATIONAL_SLUG = 'international_franchises';

export function buildCategoryChips(categories: Category[] = []): FilterChip[] {
  return [
    { id: ALL_SECTORS, label: 'All Sectors' },
    ...categories.map((c) => ({ id: c.c_slug, label: c.c_name })),
  ];
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  return items.slice(0, page * pageSize);
}

export function hasMore<T>(items: T[], page: number, pageSize: number): boolean {
  return page * pageSize < items.length;
}

export function getCompanyCoverImage(company: Company): { uri: string } | undefined {
  const img = company?.company_images?.[0];
  const raw = img?.img_name && img.img_name !== '0' ? img.img_name : img?.slider_image_name;
  const url = imageUrl(raw);
  return url ? { uri: url } : undefined;
}
