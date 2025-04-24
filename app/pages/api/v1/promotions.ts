import type { NextApiRequest, NextApiResponse } from 'next';
import type { Promotion } from '../../../services/apiClient';

// Datos de ejemplo para pruebas locales
const promotions: Promotion[] = [
  {
    id: '1',
    title: '2x1 en Espresso',
    description: 'Disfruta dos espressos al precio de uno',
    discount: 50,
    expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
  },
  {
    id: '2',
    title: 'Descuento en Latte',
    description: '20% off en Latte durante todo el día',
    discount: 20,
    expiresAt: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
  },
];

export default function handler(_req: NextApiRequest, res: NextApiResponse<Promotion[]>) {
  res.status(200).json(promotions);
} 