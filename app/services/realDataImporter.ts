import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const weaviateHost = process.env.WEAVIATE_HOST || 'http://localhost:8080';

async function main() {
  console.log(`Verificando conexión a Weaviate en ${weaviateHost}...`);
  try {
    const meta = await axios.get(`${weaviateHost}/v1/meta`);
    console.log('Weaviate responde:', meta.data);
  } catch (error: any) {
    console.error('Error de conexión a Weaviate:', error.response?.data || error.message);
    process.exit(1);
  }
  // 1. Leer JSON real
  const file = path.resolve(__dirname, '../data/menu-catar.json');
  const menuItems = JSON.parse(await fs.readFile(file, 'utf-8'));

  console.log('Importando menú real …');
  for (const item of menuItems) {
    // Verificar si el item ya existe por nombre
    const filterMenu = {
      path: ['name'],
      operator: 'Equal',
      valueText: item.name
    };
    try {
      const exists = await axios.get(
        `${weaviateHost}/v1/objects?class=MenuItem&where=${encodeURIComponent(
          JSON.stringify(filterMenu)
        )}`
      );
      if (exists.data.objects?.length > 0) {
        console.log(`Item ${item.name} ya existe, omitiendo`);
        continue;
      }
    } catch (err: any) {
      console.error(`Error chequeando existencia de ${item.name}:`, err.response?.data || err.message);
      continue;
    }
    // Crear si no existe
    try {
      await axios.post(`${weaviateHost}/v1/objects`, {
        class: 'MenuItem',
        properties: {
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price
        }
      });
      console.log(` ✓ ${item.name}`);
    } catch (error: any) {
      console.error(`Error importando ${item.name}:`, error.response?.data || error.message);
    }
  }
  console.log('Menú importado.');

  // 2. Leer promociones reales
  const promotionsFile = path.resolve(__dirname, '../data/promotions.json');
  const promotions = JSON.parse(await fs.readFile(promotionsFile, 'utf-8'));
  console.log('Importando promociones …');
  for (const promo of promotions) {
    try {
      await axios.post(`${weaviateHost}/v1/objects`, {
        class: 'Promotion',
        properties: {
          title: promo.title,
          description: promo.description,
          expiresAt: promo.expiresAt
        }
      });
      console.log(` ✓ ${promo.title}`);
    } catch (error: any) {
      console.error(`Error importando promoción ${promo.title}:`, error.response?.data || error.message);
    }
  }
  console.log('Promociones importadas.');

  // 3. Leer FAQs reales
  const faqFile = path.resolve(__dirname, '../data/menu-faq.json');
  const faqRaw = await fs.readFile(faqFile, 'utf-8');
  const faqJson = faqRaw.substring(faqRaw.indexOf('['));
  const faqs = JSON.parse(faqJson);
  console.log('Importando FAQs …');
  for (const faq of faqs) {
    try {
      await axios.post(`${weaviateHost}/v1/objects`, {
        class: 'Faq',
        properties: {
          question: faq.question,
          answer: faq.answer
        }
      });
      console.log(` ✓ ${faq.question}`);
    } catch (error: any) {
      console.error(`Error importando FAQ ${faq.question}:`, error.response?.data || error.message);
    }
  }
  console.log('FAQs importadas.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
