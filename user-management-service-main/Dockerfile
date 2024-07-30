ARG NODE_VERSION=18.14.0-alpine

FROM node:${NODE_VERSION} as build
WORKDIR /opt/app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY tsconfig*.json ./
COPY nest-cli.json nest-cli.json
COPY src src
RUN npm run build

FROM node:${NODE_VERSION}
ENV NODE_ENV=prod
WORKDIR /opt/app
COPY package*.json ./
RUN chown -R node:node /opt/app
USER node
RUN npm ci --only=prod --ignore-scripts && \
    npm rebuild
COPY --from=build --chown=node:node /opt/app/dist ./dist
CMD npm run start:prod
