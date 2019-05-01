from docker:stable
# Docker Host for the Docker in Docker Image
ENV DOCKER_HOST=tcp://docker:2375/

RUN apk add --update nodejs nodejs-npm yarn

RUN npm config set unsafe-perm true

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

RUN npm config set unsafe-perm false