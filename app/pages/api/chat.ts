import type { NextApiRequest, NextApiResponse } from 'next';
import { chatAgent } from '../../services/chatAgent';
import { appendHistory } from '../../services/sessionStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message, sessionId } = req.body;
  if (!message || !sessionId) return res.status(400).json({ error: 'message y sessionId son requeridos' });

  // Añadir mensaje de usuario
  appendHistory(sessionId, 'user', message);

  // Orquestar respuesta
  try {
    const reply = await chatAgent(sessionId, message);
    appendHistory(sessionId, 'assistant', reply);
    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
} 