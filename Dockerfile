FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY tsconfig.base.json ./
COPY lib ./lib
COPY artifacts/api-server ./artifacts/api-server

RUN pnpm install
RUN pnpm --filter @workspace/api-server run build

EXPOSE 3000

CMD ["pnpm", "--filter", "@workspace/api-server", "run", "dev"]
