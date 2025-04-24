# Stage 1: build
FROM node:18-alpine as builder
WORKDIR /app

# Copio archivos de dependencias y uso npm install para instalación reproducible (sin --production para incluir devDependencies para build)
COPY package.json package-lock.json* ./
RUN npm install --loglevel error --silent

# Copio el resto del código y construyo
COPY . .
RUN npm run build

# Stage 2: producción
FROM node:18-alpine as runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app .
# Remuevo devDependencies para producción
RUN npm prune --production
EXPOSE 3000
CMD ["npm", "run", "start"] 