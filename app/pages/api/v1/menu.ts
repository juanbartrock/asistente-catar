import type { NextApiRequest, NextApiResponse } from 'next';
import type { MenuItem } from '../../../services/apiClient';

// Datos de ejemplo para pruebas locales
const menu: MenuItem[] = [
  { id: '1', name: 'Espresso', description: 'Café espresso intenso', price: 2.5, category: 'Café' },
  { id: '2', name: 'Latte', description: 'Espresso con leche espumosa', price: 3.5, category: 'Café' },
  { id: '3', name: 'Muffin de vainilla', description: 'Muffin suave y esponjoso', price: 2.0, category: 'Bakery' },
];

export default function handler(_req: NextApiRequest, res: NextApiResponse<MenuItem[]>) {
  res.status(200).json(menu);
} 