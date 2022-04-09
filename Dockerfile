FROM node:16

WORKDIR /usr/src/app

COPY app/package*.json ./

RUN npm install

# RUN npm ci --only=production

COPY ./app .

EXPOSE 8080

CMD [ "node", "server.js" ]