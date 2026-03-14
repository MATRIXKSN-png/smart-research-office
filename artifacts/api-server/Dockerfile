FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY . /app

RUN pnpm install
RUN pnpm --filter @workspace/api-server run build

EXPOSE 3000

CMD ["pnpm", "--filter", "@workspace/api-server", "run", "dev"]
