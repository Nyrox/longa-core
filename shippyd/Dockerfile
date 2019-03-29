FROM node:lts

COPY . /opt/shippyd
WORKDIR /opt/shippyd

RUN yarn

ENV PATH="/opt/shippyd/bin:${PATH}"

ENTRYPOINT yarn watch