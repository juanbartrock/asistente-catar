export interface ChatHistory { role: 'user' | 'assistant'; content: string; }

const sessions: Record<string, ChatHistory[]> = {};

/**
 * Obtiene el historial de conversación de una sesión.
 * @param sessionId Identificador de la sesión.
 */
export function getHistory(sessionId: string): ChatHistory[] {
  if (!sessions[sessionId]) sessions[sessionId] = [];
  return sessions[sessionId];
}

/**
 * Añade un mensaje al historial de la sesión.
 * @param sessionId Identificador de la sesión.
 * @param role 'user' o 'assistant'.
 * @param content Texto del mensaje.
 */
export function appendHistory(sessionId: string, role: ChatHistory['role'], content: string): void {
  const history = getHistory(sessionId);
  history.push({ role, content });
  // Limitar largo del historial
  if (history.length > 20) history.shift();
} 