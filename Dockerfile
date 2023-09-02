FROM node:18-alpine

ENV APP_PORT="3000"

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY src /app/src

EXPOSE 3000

CMD ["npm", "start"]
