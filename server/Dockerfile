
FROM node:12-alpine
WORKDIR '/app'
COPY ./package.json ./
RUN yarn cache clean
RUN yarn
COPY . .
CMD ["yarn", "run", "start"]