FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml /app/
COPY package.json /app/
COPY pnpm-lock.yaml /app/
COPY tsconfig.json /app/
COPY tsconfig.base.json /app/
COPY lib /app/lib
COPY artifacts/api-server /app/artifacts/api-server

RUN pnpm install
RUN pnpm --filter @workspace/api-server run build

EXPOSE 3000

CMD ["pnpm", "--filter", "@workspace/api-server", "run", "dev"]
