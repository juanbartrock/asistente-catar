# Cafetería Assistant

**Descripción:** aplicación dockerizada con Next.js, PostgreSQL y Weaviate para un asistente conversacional en WhatsApp.

## Arquitectura
- **app/**: Next.js (frontend dashboard + API)
- **db**: PostgreSQL (persistencia de usuarios, promociones, menú)
- **weaviate**: vector DB para embed y búsqueda semántica del menú y FAQ

## Características
1. Asistente conversacional en WhatsApp (Twilio + OpenAI GPT-4.1-nano-2025-04-14)
2. Simulación de chat en dashboard
3. Gestión de promociones y menú
4. Integración con endpoints de la cafetería (auth, promo, menu, orders, payments)

## Requisitos
- Docker
- Docker Compose
- Variables de entorno en `.env`:
  ```
  POSTGRES_USER=
  POSTGRES_PASSWORD=
  POSTGRES_DB=
  CAFETERIA_API_BASE_URL=
  CAFETERIA_API_TOKEN=
  TWILIO_ACCOUNT_SID=
  TWILIO_AUTH_TOKEN=
  TWILIO_WHATSAPP_NUMBER=
  OPENAI_API_KEY=
  WEAVIATE_HOST=http://weaviate:8080
  ```

## Instalación
```bash
docker-compose up --build
```

## Uso
- Dashboard: http://localhost:3000
  - Sección Gestión: crear/editar promociones y menú
  - Sección Asistente: simula interacción WhatsApp
- Webhook Twilio: `{BASE_URL}/api/webhooks/twilio`

## Detalles de implementación
- **chatAgent**: combina Weaviate para búsqueda semántica y OpenAI para generar respuestas.
- **SessionStore**: mantiene contexto de cada usuario.
- **apiClient**: llama a endpoints de la cafetería.
- **twilioClient**: envía y recibe mensajes por WhatsApp.

## Modelos OpenAI
- Chat: `gpt-4.1-nano-2025-04-14`
- Embeddings: `text-embedding-ada-002`

## Control de versiones
Para subir este proyecto a un repositorio Git, sigue estos pasos:

1. Inicializa el repositorio y configura el manejo de finales de línea en Windows:
   ```bash
   git init
   git config core.autocrlf true
   ```
2. Asegúrate de que el archivo `.gitignore` esté presente en la raíz (para evitar subir dependencias y archivos temporales).
3. Añade los archivos al índice y haz el commit inicial:
   ```bash
   git add .
   git commit -m "Initial commit"
   ```
4. Conecta tu repositorio remoto y sube la rama principal:
   ```bash
   git remote add origin <URL_DEL_REPOSITORIO>
   git branch -M main
   git push -u origin main
   ```

---
Creado por el equipo de desarrollo para facilitar la interacción natural y aumentar ventas. 