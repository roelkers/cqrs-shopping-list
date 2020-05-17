FROM node:alpine
ENV REACT_APP_BASE_URL=localhost:5000
WORKDIR '/app'
COPY ./package.json ./
RUN yarn
COPY . .
CMD ["yarn", "run", "start"]