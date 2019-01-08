FROM node:9-slim

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 1923 1923

CMD ["node", "index.js"]