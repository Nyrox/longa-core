FROM node:lts


COPY ./ /opt/shippyd
WORKDIR /opt/shippyd

# Without this Nexe will complain about bin/shippyd not existing
RUN mkdir bin

# I really hate not having an editor
RUN apt update
RUN apt install nano

# Deps
RUN yarn

# Add our built executable to the path so we can invoke it globally
ENV PATH="/opt/shippyd/bin:${PATH}"

# Watch the source code volume
ENTRYPOINT yarn watch