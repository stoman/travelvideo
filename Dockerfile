FROM danlynn/ember-cli:2.8.0 AS builder
WORKDIR myapp
COPY ./package.json .
RUN npm install
COPY ./bower.json .
RUN bower install --allow-root
COPY . .
RUN ember build --environment production

FROM httpd:alpine
COPY ./docker-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=builder /myapp/myapp/dist/ /usr/local/apache2/htdocs/
COPY --from=builder /myapp/myapp/dist/.htaccess /usr/local/apache2/htdocs/
