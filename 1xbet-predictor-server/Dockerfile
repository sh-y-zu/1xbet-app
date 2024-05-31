FROM node:21

USER root

RUN apt-get update 
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 5000
CMD  npm start