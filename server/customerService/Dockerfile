FROM node

WORKDIR /app/customerService

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 8003

RUN yarn build

CMD ["yarn", "start"]