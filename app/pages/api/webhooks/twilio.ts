import type { NextApiRequest, NextApiResponse } from 'next';
import { twiml } from 'twilio';
import { chatAgent } from '../../../services/chatAgent';
import { appendHistory } from '../../../services/sessionStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const from: string = req.body.From; // e.g. 'whatsapp:+1234567890'
  const body: string = req.body.Body; // mensaje de usuario
  if (!from || !body) return res.status(400).end();

  const sessionId = from;
  // Registro mensaje de usuario
  appendHistory(sessionId, 'user', body);

  try {
    // Generar respuesta con chatAgent
    const reply = await chatAgent(sessionId, body);
    appendHistory(sessionId, 'assistant', reply);

    // Formatear TwiML
    const MessagingResponse = twiml.MessagingResponse;
    const response = new MessagingResponse();
    response.message(reply);

    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(response.toString());
  } catch (error) {
    console.error('Webhook Twilio error:', error);
    return res.status(500).end();
  }
} 