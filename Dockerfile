# Etapa 1: Build

FROM node:22-alpine AS builder

# Instalar dependencias del sistema necesarias para la compilación
RUN apk add --no-cache openssl libc6-compat

# Crear usuario y grupo no root
RUN addgroup -S pharma && adduser -S pharma -G pharma

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma
    
# Instalar dependencias (usando package-lock.json)
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Generar el cliente Prisma (no lo ejecutará en runtime)
RUN npx prisma generate

# Cambiar la propiedad de los archivos al usuario no root
RUN chown -R pharma:pharma /app

# Etapa 2: Runtime (más ligera y segura)
FROM node:22-alpine

# Instalar solo librerías del sistema que necesita la app
RUN apk add --no-cache openssl libc6-compat

# Crear el mismo usuario y grupo (no se heredan entre etapas)
RUN addgroup -S pharma && adduser -S pharma -G pharma

# Crear y preparar el directorio de trabajo
WORKDIR /app
RUN chown -R pharma:pharma /app

# Copiar los archivos desde la etapa de build
COPY --from=builder /app /app

# Cambiar al usuario no root
USER pharma

EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "start"]
