FROM node:20.12-alpine3.18

RUN apk update && apk add --no-cache git

WORKDIR /app/proxy

RUN git clone -b main https://github.com/oshuster/trademark-proxy.git .

ENV PORT=8181

RUN npm install

EXPOSE 8181

CMD ["npm", "start"]
