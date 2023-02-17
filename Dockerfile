FROM node:16.19-alpine as build

RUN npm install -g pnpm@7.27.0

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile && pnpm build

#-------------
FROM nginx:1.23.3-alpine

COPY --from=build /app/dist /usr/share/nginx/html
