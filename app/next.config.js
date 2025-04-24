module.exports = {
  reactStrictMode: true,
  env: {
    CAFETERIA_API_BASE_URL: process.env.CAFETERIA_API_BASE_URL,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    WEAVIATE_HOST: process.env.WEAVIATE_HOST,
  },
}; 