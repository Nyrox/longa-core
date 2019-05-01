from docker:stable

RUN apk add --update nodejs nodejs-npm yarn

# Clone the codebase
COPY ./ /shippy-source
WORKDIR /shippy-source

# Build shippyd
WORKDIR /shippy-source/shippyd
RUN yarn
RUN yarn build-only
RUN npm install -g

# Build shippy
WORKDIR /shippy-source/shippy-cli
RUN yarn
RUN yarn build
RUN npm install -g

