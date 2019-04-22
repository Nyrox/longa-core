FROM node:lts

COPY . /srv/crash-test
WORKDIR /srv/crash-test

EXPOSE 3000

RUN yarn
ENTRYPOINT yarn start