# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
COPY ./src ./src
EXPOSE 3004
CMD ["npm", "start"]
