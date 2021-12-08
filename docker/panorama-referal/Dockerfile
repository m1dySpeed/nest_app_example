FROM node:14-alpine

WORKDIR /usr/project

COPY package*.json ./

COPY . .

RUN npm i --silent

RUN npm run project:build

CMD ["npm", "run", "project:start"]