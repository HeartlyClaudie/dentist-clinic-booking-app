# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache --virtual .build-deps python3 make g++ \
 && npm install sqlite3 \
 && apk del .build-deps
COPY --from=builder /app .
EXPOSE 3000
CMD ["node", "server.js"]
