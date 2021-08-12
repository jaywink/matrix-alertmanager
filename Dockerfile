#FROM node:14
FROM node:14-alpine

RUN \
  apk update && \
  apk upgrade && \
  apk add --no-cache git bash openssh-client rsync curl && \
  node -v && yarn -v && npm -v && git --version && bash --version && ssh -V && rsync --version && curl -V

ENV APP_PORT="3000"

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
