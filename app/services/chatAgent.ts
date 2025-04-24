import { openai } from '../utils/openai';
import { searchMenu, searchPromotions, searchFaqs } from './weaviateClient';
import { getHistory, appendHistory } from './sessionStore';

/**
 * Orquesta la conversación usando RAG (Weaviate + GPT-4).
 * @param sessionId Id de la sesión (p.ej. número de WhatsApp).
 * @param message Mensaje del usuario.
 */
export async function chatAgent(sessionId: string, message: string): Promise<string> {
  // Guardar mensaje de usuario
  appendHistory(sessionId, 'user', message);

  // INIT: saludo con promociones globales
  if (message === '__INIT__') {
    const promos = await searchPromotions('__ALL__', 5);
    const list = promos.length
      ? promos.map((p: any) => `- ${p.title}: ${p.description}`).join('\n')
      : 'No hay promociones disponibles.';
    const saludo = `¡Hola! Bienvenido a Catar Café. Hoy tenemos:\n${list}\n\n¿Cómo puedo ayudarte?`;
    appendHistory(sessionId, 'assistant', saludo);
    return saludo;
  }

  // Recuperar contexto RAG
  const menuHits = await searchMenu(message);
  const promoHits = await searchPromotions(message);
  const faqHits = await searchFaqs(message);
  console.log(`[RAG] message="${message}" faqHits:`, faqHits);
  const faqContext = faqHits
    .map((f: any) => `- ${f.question}: ${f.answer}`)
    .join('\n');
  console.log('[RAG] faqContext:', faqContext);
  console.log(`[RAG] message="${message}" menuHits:`, menuHits);
  console.log(`[RAG] message="${message}" promoHits:`, promoHits);
  // Construir contexto de menú: nombre, categoría, precio y descripción opcional
  const menuContext = menuHits
    .map((m: any) => `- ${m.name} (${m.category}, $${m.price})${m.description ? `: ${m.description}` : ''}`)
    .join('\n');
  console.log('[RAG] menuContext:', menuContext);
  // Construir contexto de promociones: título, descripción y expiración
  const promoContext = promoHits
    .map((p: any) => `- ${p.title} (${p.expiresAt}): ${p.description}`)
    .join('\n');
  console.log('[RAG] promoContext:', promoContext);

  // Construir prompt
  // Guía de estilo para respuestas claras
  const styleGuidelines = 'Organiza tus respuestas en secciones claras y usa viñetas o numeración al listar opciones. Sé breve y conciso.';
  const systemPrompt = `${styleGuidelines} Eres un amable asistente de ventas para una cafetería de especialidad. Tu objetivo es recomendar productos y cerrar la venta.`;
  const history = getHistory(sessionId)
    .map(h => `${h.role === 'user' ? 'Usuario' : 'Asistente'}: ${h.content}`)
    .join('\n');
  const userPrompt = `Contexto MENÚ:\n${menuContext}\n\nContexto PROMOCIONES:\n${promoContext}\n\nContexto PREGUNTAS FRECUENTES:\n${faqContext}\n\nHistorial:\n${history}\n\nUsuario: ${message}`;

  // Llamada a OpenAI
  const resp = await openai.chat.completions.create({
    model: 'gpt-4.1-nano-2025-04-14',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
  });

  // Asegurarnos de que existe contenido antes de trim
  const content = resp.choices?.[0]?.message?.content;
  const answer = content ? content.trim() : 'Lo siento, no pude procesar tu solicitud.';
  appendHistory(sessionId, 'assistant', answer);
  return answer;
} 