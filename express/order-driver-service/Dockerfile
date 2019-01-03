FROM node:9-slim

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 1924 1924

CMD ["node", "order-driver-service.js"]