export const getMenuHits = {
  name: 'getMenuHits',
  description: 'Busca ítems del menú relacionados al texto de entrada',
  parameters: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'Texto de búsqueda para ítems del menú' },
      limit: { type: 'number', description: 'Número máximo de ítems a retornar', default: 5 }
    },
    required: ['text']
  }
};

export const getPromoHits = {
  name: 'getPromoHits',
  description: 'Busca promociones relacionadas al texto de entrada',
  parameters: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'Texto de búsqueda para promociones' },
      limit: { type: 'number', description: 'Número máximo de promociones a retornar', default: 5 }
    },
    required: ['text']
  }
};

export const getFaqHits = {
  name: 'getFaqHits',
  description: 'Busca preguntas frecuentes relacionadas al texto de entrada',
  parameters: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'Texto de búsqueda para preguntas frecuentes' },
      limit: { type: 'number', description: 'Número máximo de FAQs a retornar', default: 5 }
    },
    required: ['text']
  }
}; 