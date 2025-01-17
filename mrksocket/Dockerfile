FROM node:22.13.0-slim AS builder
WORKDIR /app

COPY pubsub /app/pubsub
COPY util /app/util
COPY websocket /app/websocket
COPY app.js package*.json /app/

RUN npm install --omit=dev
EXPOSE 8100

CMD ["node", "app.js"]
