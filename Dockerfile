FROM node:20-alpine AS builder
RUN npm install -g pnpm -y

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm i

COPY tsconfig.json ./
COPY src ./src

RUN pnpm run build 

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD [ "node","dist/server.js" ]