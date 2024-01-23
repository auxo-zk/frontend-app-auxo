FROM node:20-alpine as build

RUN npm install -g npm@9.6.4

WORKDIR /app

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD yarn start