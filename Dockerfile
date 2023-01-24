FROM node:14-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci

RUN npm run project:build

CMD ["npm", "run", "project:start"]
