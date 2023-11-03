FROM node

WORKDIR /app/userService

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --network-timeout 60000

COPY . .

EXPOSE 8003

RUN yarn build

CMD ["yarn", "start"]