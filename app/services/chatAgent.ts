import { openai } from '../utils/openai';
import { searchMenu, searchPromotions, searchFaqs } from './tools/rag';
import { getMenuHits, getPromoHits, getFaqHits } from './tools/openai';
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

  // Primera llamada a OpenAI con Function Calling para RAG
  const initialResp = await openai.chat.completions.create({
    model: 'gpt-4.1-nano-2025-04-14',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    functions: [getMenuHits, getPromoHits, getFaqHits],
    function_call: 'auto',
    temperature: 0.7,
  });

  const initialMessage = initialResp.choices?.[0]?.message;
  console.log('[RAG Function] initialMessage:', initialMessage);
  // Si el modelo decide llamar a una función RAG
  if (initialMessage?.function_call) {
    const { name, arguments: argsJson } = initialMessage.function_call;
    const args = JSON.parse(argsJson);
    console.log(`[RAG Function] Calling function: ${name} with args:`, args);
    let funcResult: any[] = [];
    if (name === 'getMenuHits') {
      funcResult = await searchMenu(args.text, args.limit);
    } else if (name === 'getPromoHits') {
      funcResult = await searchPromotions(args.text, args.limit);
    } else if (name === 'getFaqHits') {
      funcResult = await searchFaqs(args.text, args.limit);
    }
    console.log(`[RAG Function] Result from ${initialMessage.function_call.name}:`, funcResult);
    // Segunda llamada reenviando el resultado de la función
    const followUpResp = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
        initialMessage,
        { role: 'function', name, content: JSON.stringify(funcResult) }
      ],
      temperature: 0.7,
    });
    console.log('[RAG FollowUp] response message:', followUpResp.choices?.[0]?.message);
    const finalContent = followUpResp.choices?.[0]?.message?.content?.trim();
    const finalAnswer = finalContent || 'Lo siento, no pude procesar tu solicitud.';
    appendHistory(sessionId, 'assistant', finalAnswer);
    return finalAnswer;
  }
  // No se invocó función; respuesta directa
  console.log('[RAG] No function_call detected; direct response content:', initialMessage?.content);
  // Si no se invoca función, devuelve la respuesta directamente
  const textContent = initialMessage?.content?.trim();
  const answer = textContent || 'Lo siento, no pude procesar tu solicitud.';
  appendHistory(sessionId, 'assistant', answer);
  return answer;
} 