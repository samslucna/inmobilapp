FROM node:22-alpine As builder

ENV NODE_VERSION 22

WORKDIR /app
COPY ./ /app

ENV NODE_OPTIONS=--max_old_space_size=8192
RUN npm install
RUN npm run build

FROM httpd:2.4
COPY --from=builder /app/build/ /usr/local/apache2/htdocs/
COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf