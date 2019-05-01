from node:lts

COPY ./ /shippy-source
WORKDIR /shippy-source

WORKDIR /shippy-source/shippyd
RUN yarn
RUN yarn build-only
RUN npm install -g

WORKDIR /shippy-source/shippy-cli
RUN yarn
RUN yarn build
RUN npm install -g

