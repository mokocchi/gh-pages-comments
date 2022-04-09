FROM node:16

WORKDIR /usr/src/app

COPY app/package*.json ./

RUN npm install

# RUN npm ci --only=production

COPY ./app .

CMD [ "sh", "-c", "npx sequelize-cli db:migrate && node server.js" ]