FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM httpd:alpine

COPY ./docker-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=builder /app/dist/ /usr/local/apache2/htdocs/
COPY --from=builder /app/dist/.htaccess /usr/local/apache2/htdocs/
RUN chown -R daemon:daemon /usr/local/apache2/htdocs/ && \
    chown daemon:daemon /usr/local/apache2/conf/httpd.conf && \
    chown -R daemon:daemon /usr/local/apache2/logs/
USER daemon
