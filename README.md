
# longa is a tool to help you deploy docker containers in CI faster and cleaner

## DISCLAIMER
Do not even try to use this.  
This was made as part of my programming exam and is merely a proof of concept.  
There is far better and more established tool to archieve everything this does and more!

## longa-srv

longa-srv is the server-side application keeping your deployments organized.  
By keeping server configuration centered in one place, you spend less time configuring your individual containers and more time enjoying your containers running smoothly!  

It also acts as a sort of "server" the longa client uses to deploy things.  


# longa

The client takes your written dockerfiles and longa config files and turns them into a deployment on your target server running longa-srv!  

The longa client (and server) work through a docker registry of your choosing.  
It's mainly been developed with gitlab in mind, both in CI and Registry, but any provider should work (including dockerhub!).  

A minimal example looks kinda like this:

```yml
image: your.registry.domain/longa/longa:latest

services:
  - docker:dind

build:
  stage: build
  script:
    - longa build --image $CI_COMMIT_REF_SLUG --tag latest
    - longa publish --image $CI_COMMIT_REF_SLUG --tag latest -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD
	- longa deploy -h $HOST_DOMAIN -i "$CI_COMMIT_REF_SLUG" -t latest -u $HOST_USER
  variables:
    DEPLOY_KEY: $HOST_PRIVKEY
```