FROM node:16 as build

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY ./vhost.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
