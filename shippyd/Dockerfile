FROM node:lts


COPY . /opt/shippyd
WORKDIR /opt/shippyd

RUN yarn global add nodemon
RUN yarn
RUN npm link

ENTRYPOINT nodemon --watch 'src/**/*.ts' --exec 'yarn build && npm pack && npm i -g'