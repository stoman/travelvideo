FROM danlynn/ember-cli:6.7.2 AS builder
WORKDIR /myapp
COPY ./package.json .
RUN npm install

COPY . .
RUN ember build --environment production

FROM httpd:alpine
COPY ./docker-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=builder /myapp/dist/ /usr/local/apache2/htdocs/
COPY --from=builder /myapp/dist/.htaccess /usr/local/apache2/htdocs/
