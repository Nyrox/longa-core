import * as Program from "commander"
import * as child_process from "child_process"

import * as Config from "./config"
import { chmod } from "fs"

import * as CliTools from "./cli"

// Dotenv
require("dotenv").config()



Program.command("deploy")
    .option("-h, --host", "Hostname of the target server")
    .option("-u, --user", "User which will be used to tunnel into the server")
    .option("-k, --key", "Private key of the ssh user")
    .action(function(cmd) {
        console.log("Deploying to: " + cmd.host + " using " + cmd.user + ":" + cmd.key)
    })

Program.command("generate [flags...]").action(function(cmd) {
    console.log(cmd)
})

Program.command("build")
	.option("--tag <tag>", "Annotate the image you are building.")
	.option("--publish", "Publish")
	.option("-u, --user <user>", "User to login to the docker registry")
	.option("-p, --pass <pass>", "Password used to sign into the registry")
    .option(
        "--context <context>",
        "Change the working directory context in which to run shippy"
    )
    .action(({ tag, context, publish, user, pass }) => {
        console.log(tag, context)

        if (context) process.chdir(context)

        let config = Config.load()

        if (config === null) {
            console.error("No shippy config file found in this location.")
            return false
        }

        let imageName = `${config.registry.host}/${config.project.group}/${
            config.project.name
        }`

		let imageTag = tag ? `:${tag}` : "";

        let buildCommand = `docker build -t ${imageName}${imageTag}  -f ${config.dockerfile} .`

        console.info(buildCommand)
        child_process.execSync(buildCommand, {stdio: "inherit"});

		if (!publish) return;

		let registryUser = process.env.REGISTRY_USER || user
        let registryPass = process.env.REGISTRY_PASS || pass

		if (
            !CliTools.insist(
                registryUser,
                "Please supply a registry username through cli parameters or environment variables"
            ) ||
            !CliTools.insist(
                registryPass,
                "Please supply a registry password through cli parameters or environment variables"
            )
        ) {
            return
        }

        // Login
		let loginCommand = `docker login -u ${registryUser} -p ${registryPass} ${config.registry.host}`
		child_process.execSync(loginCommand, {stdio: "inherit"});
		
		let publishCommand = `docker push ${imageName}`
		console.info(publishCommand);
		
		child_process.execSync(publishCommand, {stdio: "inherit"});

    })

Program.command("publish <tag>")
    .option("-u, --user <user>", "User to login to the docker registry")
	.option("-p, --pass <pass>", "Password used to sign into the registry")
	.option(
        "--context <context>",
        "Change the working directory context in which to run shippy"
	)
    .action((tag, cmd) => {
        let registryUser = process.env.REGISTRY_USER || cmd.user
        let registryPass = process.env.REGISTRY_PASS || cmd.pass

	
		if(cmd.context) process.chdir(cmd.context);

        let config = Config.load()

        if (config === null) {
            console.error("No shippy config file found in this location.")
            return false
        }

        if (
            !CliTools.insist(
                registryUser,
                "Please supply a registry username through cli parameters or environment variables"
            ) ||
            !CliTools.insist(
                registryPass,
                "Please supply a registry password through cli parameters or environment variables"
            )
        ) {
            return
        }

        // Login
		let loginCommand = `docker login -u ${registryUser} -p ${registryPass} ${config.registry.host}`
		child_process.exec(loginCommand, (error, out, err) => {
			if (error) console.error(err)
			else {
				console.log(out);
			}
		})
    })

Program.version("1.0.0").parse(process.argv)
