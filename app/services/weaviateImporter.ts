import axios from 'axios';

// Hosts
const apiHost = process.env.CAFETERIA_API_BASE_URL || 'http://localhost:3000';
const weaviateHost = process.env.WEAVIATE_HOST || 'http://localhost:8080';

async function main() {
  // Obtener datos de menú desde API Next.js
  console.log('Importando menú a Weaviate...');
  let menuItems: any[];
  try {
    const res = await axios.get(`${apiHost}/api/v1/menu`);
    menuItems = res.data;
  } catch (err) {
    console.error('Error obteniendo menú desde API:', err);
    process.exit(1);
  }

  for (const item of menuItems) {
    try {
      await axios.post(
        `${weaviateHost}/v1/objects`,
        {
          class: 'MenuItem',
          properties: {
            name: item.name,
            description: item.description,
            category: item.category,
            price: item.price,
          },
        }
      );
      console.log(`  ✓ ${item.name}`);
    } catch (err) {
      console.error(`Error importando ${item.name}:`, err);
    }
  }

  // Obtener datos de promociones desde API Next.js
  console.log('Importando promociones a Weaviate...');
  let promotions: any[];
  try {
    const res2 = await axios.get(`${apiHost}/api/v1/promotions`);
    promotions = res2.data;
  } catch (err) {
    console.error('Error obteniendo promociones desde API:', err);
    process.exit(1);
  }

  for (const promo of promotions) {
    try {
      await axios.post(
        `${weaviateHost}/v1/objects`,
        {
          class: 'Promotion',
          properties: {
            title: promo.title,
            description: promo.description,
            expiresAt: promo.expiresAt,
          },
        }
      );
      console.log(`  ✓ ${promo.title}`);
    } catch (err) {
      console.error(`Error importando ${promo.title}:`, err);
    }
  }

  console.log('Importación completada.');
}

main().catch(err => {
  console.error('Error importando datos en Weaviate:', err);
  process.exit(1);
}); 