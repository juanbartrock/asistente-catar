import twilio, { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER as string;

// Instancia de cliente Twilio
const client: Twilio = twilio(accountSid, authToken);

/**
 * Envía un mensaje de WhatsApp usando Twilio.
 * @param to Número de destino (e.g. 'whatsapp:+1234567890').
 * @param body Texto del mensaje.
 */
export async function sendWhatsAppMessage(to: string, body: string) {
  return client.messages.create({
    to,
    from: fromNumber,
    body,
  });
} 