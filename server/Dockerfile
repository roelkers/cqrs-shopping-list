
FROM node:12-alpine
WORKDIR '/app'
COPY ./package.json ./
RUN yarn cache clean
RUN yarn
ENV REACT_APP_BASE_URL=https://shopping-list-cqrs.herokuapp.com/
COPY . .
CMD ["yarn", "run", "start"]