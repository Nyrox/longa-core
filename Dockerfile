from docker:stable
# Docker Host for the Docker in Docker Image
ENV DOCKER_HOST=tcp://docker:2375/

RUN apk add --update nodejs nodejs-npm yarn

RUN npm config set unsafe-perm true

# Clone the codebase
COPY ./ /longa-source
WORKDIR /longa-source

# Build the server
WORKDIR /longa-source/longa-srv
RUN yarn
RUN yarn build-only
RUN npm install -g

# Build the client
WORKDIR /longa-source/longa
RUN yarn
RUN yarn build
RUN npm install -g

RUN npm config set unsafe-perm false