import { searchMenu as weaviateSearchMenu, searchPromotions as weaviateSearchPromotions, searchFaqs as weaviateSearchFaqs } from '../weaviateClient';

export async function searchMenu(text: string, limit: number = 5): Promise<any[]> {
  return weaviateSearchMenu(text);
}

export async function searchPromotions(text: string, limit: number = 5): Promise<any[]> {
  return weaviateSearchPromotions(text, limit);
}

export async function searchFaqs(text: string, limit: number = 5): Promise<any[]> {
  return weaviateSearchFaqs(text, limit);
} 