FROM danlynn/ember-cli:6.8.0 AS builder
WORKDIR /myapp
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN ember build --environment production

FROM httpd:alpine

# Run as non-root user



COPY ./docker-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=builder /myapp/dist/ /usr/local/apache2/htdocs/
COPY --from=builder /myapp/dist/.htaccess /usr/local/apache2/htdocs/
RUN chown -R daemon:daemon /usr/local/apache2/htdocs/ && \
    chown daemon:daemon /usr/local/apache2/conf/httpd.conf && \
    chown -R daemon:daemon /usr/local/apache2/logs/
USER daemon
