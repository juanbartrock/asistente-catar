import axios from 'axios';

const api = axios.create({
  baseURL: process.env.CAFETERIA_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  expiresAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

/** Obtiene las promociones activas */
export async function fetchPromotions(): Promise<Promotion[]> {
  const res = await api.get<Promotion[]>('/api/v1/promotions');
  return res.data;
}

/** Obtiene el menú del local */
export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await api.get<MenuItem[]>('/api/v1/menu');
  return res.data;
} 