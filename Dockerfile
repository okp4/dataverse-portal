FROM node:20.6-alpine as build

RUN npm install -g pnpm@8.3.1

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile && pnpm build

#-------------
FROM nginx:1.25.2-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
