FROM node:9

WORKDIR /usr/app/

ADD package.json lerna.json tsconfig.json yarn.lock ./
ADD packages/pipethrough/package.json ./packages/pipethrough/package.json
ADD packages/pipethrough-shared/package.json ./packages/pipethrough-shared/package.json

RUN yarn

ADD packages/pipethrough/src ./packages/pipethrough/src
ADD packages/pipethrough-shared/src ./packages/pipethrough-shared/src

EXPOSE 3000

CMD yarn --cwd packages/pipethrough start