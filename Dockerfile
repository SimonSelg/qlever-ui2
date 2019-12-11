FROM node:alpine as node_root
WORKDIR /package/
COPY package.json .
COPY yarn.lock .
COPY qlever-ui2-frontend/package.json ./qlever-ui2-frontend/
COPY qlever-ui2-shared/package.json ./qlever-ui2-shared/
COPY qlever-ui2-backend/package.json ./qlever-ui2-backend/

FROM node:alpine as node_cache
WORKDIR /cache/
COPY --from=node_root /package/ /cache
RUN yarn

FROM node:alpine as node_builder
RUN apk add --no-cache git
WORKDIR /application
COPY --from=node_cache /cache/ /application
COPY . /application
RUN yarn build
RUN rm -rf /application/node_modules

FROM node:alpine
WORKDIR /application
COPY --from=node_root /package/ /application
RUN yarn --production
COPY --from=node_builder /application /application

CMD ["yarn", "production"]
