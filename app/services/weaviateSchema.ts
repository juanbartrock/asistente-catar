import axios from 'axios';

async function main() {
  const defaultWeaviateHost = process.env.NODE_ENV === 'production'
    ? 'http://weaviate:8080'
    : 'http://localhost:8080';
  const url = process.env.WEAVIATE_HOST || defaultWeaviateHost;

  // Clases a crear
  const classes = [
    {
      name: 'MenuItem',
      schema: {
        class: 'MenuItem',
        vectorizer: 'text2vec-openai',
        description: 'Items del menú de la cafetería',
        properties: [
          { name: 'name', dataType: ['text'], description: 'Nombre del producto' },
          { name: 'description', dataType: ['text'], description: 'Descripción del producto' },
          { name: 'category', dataType: ['text'], description: 'Categoría del producto' },
          { name: 'price', dataType: ['number'], description: 'Precio del producto' }
        ]
      }
    },
    {
      name: 'Promotion',
      schema: {
        class: 'Promotion',
        vectorizer: 'text2vec-openai',
        description: 'Promociones vigentes',
        properties: [
          { name: 'title', dataType: ['text'], description: 'Título de la promoción' },
          { name: 'description', dataType: ['text'], description: 'Descripción de la promoción' },
          { name: 'expiresAt', dataType: ['date'], description: 'Fecha de expiración de la promoción' }
        ]
      }
    },
    {
      name: 'Faq',
      schema: {
        class: 'Faq',
        vectorizer: 'text2vec-openai',
        description: 'Preguntas frecuentes de la cafetería',
        properties: [
          { name: 'question', dataType: ['text'], description: 'Pregunta frecuente' },
          { name: 'answer', dataType: ['text'], description: 'Respuesta de la pregunta' }
        ]
      }
    }
  ];

  // Obtener esquema actual
  const resp = await axios.get(`${url}/v1/schema`);
  const existing = resp.data.classes.map((c: any) => c.class);

  for (const cls of classes) {
    if (existing.includes(cls.name)) {
      console.log(`Clase ${cls.name} ya existe, omitiendo`);
    } else {
      try {
        console.log(`Creando clase ${cls.name}...`);
        await axios.post(`${url}/v1/schema`, cls.schema);
        console.log(`✓ Clase ${cls.name} creada`);
      } catch (error: any) {
        console.error(`Error creando clase ${cls.name}:`, error.response?.data || error.message);
      }
    }
  }

  console.log('Proceso de esquema finalizado');
}

main().catch((err) => {
  console.error('Error en weaviateSchema:', err);
  process.exit(1);
}); 