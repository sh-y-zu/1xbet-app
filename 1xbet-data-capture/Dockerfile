FROM ghcr.io/puppeteer/puppeteer:21.6.1

USER root

RUN apt-get update && \
    apt-get install -y xvfb


ENV WS_SERVER=http://game-server:8080
ENV CRASH_APP=https://1xbet.com/en/allgamesentrance/crash

ENV DISPLAY=:99

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable  \
    NODE_ENV=production


WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

# Start xvfb and run the application
CMD xvfb-run --auto-servernum --server-args="-screen 0 1280x1024x24" npm start