FROM node:22-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

ENV DOCKER=true
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["sh", "-c", "npx prisma generate && npm run dev"]
