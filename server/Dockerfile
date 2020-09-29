
FROM node:12-alpine
WORKDIR '/app'
COPY ./package.json ./
RUN yarn cache clean
RUN yarn
RUN yarn global add ts-node
RUN yarn global add ts-node-dev 
RUN yarn global add typescript
ENV REACT_APP_BASE_URL=https://shopping-list-cqrs.herokuapp.com/
COPY . .
CMD ["yarn", "run", "start"]