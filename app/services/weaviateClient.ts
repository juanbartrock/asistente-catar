import axios from 'axios';

// Configurar host de Weaviate HTTP (GraphQL)
const defaultWeaviateHost = process.env.NODE_ENV === 'production'
  ? 'http://weaviate:8080'
  : 'http://localhost:8080';
const weaviateHost = process.env.WEAVIATE_HOST || defaultWeaviateHost;

/**
 * Busca en la clase MenuItem los ítems relacionados al texto.
 * @param text Texto de consulta.
 */
export async function searchMenu(text: string): Promise<any[]> {
  try {
    const query = `{
      Get {
        MenuItem(nearText: { concepts: ["${text}"] }, limit: 5) {
          name
          description
          category
          price
        }
      }
    }`;
    const resp = await axios.post(
      `${weaviateHost}/v1/graphql`,
      { query }
    );
    return resp.data.data.Get.MenuItem || [];
  } catch (err) {
    console.error('Error en WeaviateClient.searchMenu:', err);
    return [];
  }
}

/**
 * Busca en la clase Promotion los objetos relacionados al texto.
 * @param text Texto de consulta.
 * @param limit Número de resultados.
 */
export async function searchPromotions(text: string, limit: number = 5): Promise<any[]> {
  try {
    const filter = text === '__ALL__' ? '' : `nearText: { concepts: ["${text}"] }, `;
    const query = `{
      Get {
        Promotion(${filter}limit: ${limit}) {
          title
          description
          expiresAt
        }
      }
    }`;
    const resp = await axios.post(
      `${weaviateHost}/v1/graphql`,
      { query }
    );
    return resp.data.data.Get.Promotion || [];
  } catch (err) {
    console.error('Error en WeaviateClient.searchPromotions:', err);
    return [];
  }
}

/**
 * Busca en la clase Faq preguntas frecuentes relacionadas al texto.
 * @param text Texto de consulta.
 * @param limit Número de resultados.
 */
export async function searchFaqs(text: string, limit: number = 5): Promise<any[]> {
  try {
    const filter = text ? `nearText: { concepts: ["${text}"] }, ` : '';
    const query = `{
      Get {
        Faq(${filter}limit: ${limit}) {
          question
          answer
        }
      }
    }`;
    const resp = await axios.post(
      `${weaviateHost}/v1/graphql`,
      { query }
    );
    return resp.data.data.Get.Faq || [];
  } catch (err) {
    console.error('Error en WeaviateClient.searchFaqs:', err);
    return [];
  }
} 