FROM node:14-alpine
WORKDIR '/app'
COPY ./package.json ./
RUN yarn cache clean
RUN yarn
COPY . .
CMD ["yarn", "run", "start"]
