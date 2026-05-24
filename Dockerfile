FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile 2>/dev/null || yarn install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN yarn build

EXPOSE 3000

CMD npx prisma migrate deploy && node dist/main
