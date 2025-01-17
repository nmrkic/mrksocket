# Stage 0, based on Node.js, to build and compile Angular
FROM node:22.13.0-slim as node
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install --silent
COPY src /app/src/
COPY public /app/public/
COPY index.html vite.config.js /app/
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
# FROM nginx:alpine
FROM byjg/nginx-extras:1.21
COPY --from=node /app/dist/ /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html/
COPY config/start.sh /
RUN chmod -R +rw /usr/share/nginx/html

# Add bash
RUN apk add --no-cache bash
CMD ["/start.sh"]
