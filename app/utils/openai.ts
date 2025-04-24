import OpenAI from 'openai';

// Instanciar cliente OpenAI para chat y embeddings
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); 