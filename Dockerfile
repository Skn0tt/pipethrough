FROM node:9

WORKDIR /usr/app/

ADD package.json yarn.lock tsconfig.json ./
RUN yarn

ADD ./src ./src

EXPOSE 3000

CMD yarn start