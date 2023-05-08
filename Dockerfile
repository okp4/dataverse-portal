FROM node:20.1-alpine as build

RUN npm install -g pnpm@8.3.1

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile && pnpm build

#-------------
FROM nginx:1.23.4-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
