FROM node:14.15
WORKDIR /code
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]
