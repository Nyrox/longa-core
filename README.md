


## Shippy helps you build docker containers, run test and deploy them to a server running shippy-d



## Requirements

Must be easily understood and used on a basic level by people with little to not devops experience.  
Simple cases should be simple to manage, create a template once use it for any future projects.  

Complex cases need to be allowed complexity. The user should be able to opt-out of any shippy features that keep them from doing complex things.  
Convention is good, but when conventions fail they need to be configureable.  

Shippy needs to be reliable. Once you spent your time making the templates you need, they should keep working no matter what you do.  

Shippy needs to have exceptional logging and error handling.  


## Architecture




## Brainstorm

shippy new/init --template blabla


shippy deploy  
	--host=staging.ministry.de  
	--user=gitlab-cd
	--key=$OSCAR_SSH_PRIV_KEY
	--tag=${CI_COMMIT_REF_SLUG}:latest







# Shippy-D


## Functionality

- Build containers
- Run tests inside the container
- Upload the container to a registry
- Deploy containers




## Wordpress


