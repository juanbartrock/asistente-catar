import axios from 'axios';

/**
 * Envía un mensaje al endpoint interno de chat y retorna la respuesta.
 * @param message Texto del usuario o '__INIT__' para saludo inicial.
 * @param sessionId Identificador de la sesión.
 */
export async function sendChatMessage(message: string, sessionId: string): Promise<string> {
  try {
    const res = await axios.post('/api/chat', { message, sessionId });
    return res.data.reply as string;
  } catch (error) {
    console.error('Error en sendChatMessage:', error);
    return 'Lo siento, hubo un error al procesar tu mensaje.';
  }
} 