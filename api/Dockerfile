FROM node:22-alpine

WORKDIR /var/www/data_entry/qp_gen/api

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "app.js"]

