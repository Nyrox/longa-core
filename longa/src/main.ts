#!/usr/bin/env node

import * as Program from "commander"
import * as child_process from "child_process"

import * as Config from "./config"
import { chmod } from "fs"

import * as CliTools from "./cli"
import * as Service from "./service";

import * as sequest from "sequest";

// Dotenv
require("dotenv").config()


Program.command("build")
	.option("--tag <tag>", "Annotate the image you are building.")
	.option("--image <image>", "Change the image name. Default is the repository name, when overwritten the image name is appended to the repository path.")
    .option(
        "--context <context>",
        "Change the working directory context in which to run longa"
    )
    .action(({ tag, image, context, publish, user, pass }) => {
        console.log(tag, context)

        if (context) process.chdir(context)

        let config = Config.load()

        if (config === null) {
            console.error("No longa config file found in this location.")
            return false
        }

        let imageName = `${config.registry.host}/${config.project.group}/${
            config.project.name
            }` + (image ? `/${image}` : "");

        let imageTag = tag ? `:${tag}` : "";

        let buildCommand = `docker build -t ${imageName}${imageTag}  -f ${config.dockerfile} .`

        console.info(buildCommand)
        child_process.execSync(buildCommand, { stdio: "inherit" });
    })

Program.command("publish")
	.option("--tag <tag>", "")
	.option("--image <image>", "Change the image name. Default is the repository name, when overwritten the image name is appended to the repository path.")
    .option("-u, --user <user>", "User to login to the docker registry")
    .option("-p, --pass <pass>", "Password used to sign into the registry")
    .option(
        "--context <context>",
        "Change the working directory context in which to run longa"
    )
    .action((cmd) => {
        if (cmd.context) process.chdir(cmd.context)

        let config = Config.load()
        if (!CliTools.insist(config !== null, "No config file found at this location")) { return }

        return Service.publish(cmd.image, cmd.tag, {
            registry: {
                user: process.env.REGISTRY_USER || cmd.user,
                pass: process.env.REGISTRY_PASS || cmd.pass,
                host: config.registry.host
            }
        })
    })

Program.command("deploy")
    .option("-h, --host <host>", "Host to deploy to")
    .option("-u, --user <user>", "SSH User to deploy with")
    .option("--auth-key <key>", "SSH Private Key to deploy with")
    .option("--auth-pass <pass>", "SSH Password to deploy with")
    .option(
        "--context <context>",
        "Change the working directory context in which to run longa"
    )
    .action(async (cmd) => {
		if (cmd.context) process.chdir(cmd.context)
		
        let config = Config.load()
		
        let key = process.env.DEPLOY_KEY || cmd.authKey;
        let pass = process.env.DEPLOY_PASS || cmd.authPass;
		
		console.log(cmd)
		console.log(`Deploying to ${cmd.host} using ${cmd.user}`)
		
        CliTools.insistOr (config != null, "No configuration file found at this location", _ => process.exit(-1));
        CliTools.insistOr (cmd.host != null, "Please provide a host to deploy to", _ => process.exit(-1));
        CliTools.insistOr (cmd.user != null, "Please provide a user to deploy with", _ => process.exit(-1));
        CliTools.insistOr (!(key && pass), "You have set a password and a private key to authenticate with. Please make sure to choose one", _ => process.exit(-1));
        CliTools.insistOr (key || pass, "Neither a password nor a private key is set for authentication. Please be sure to set one.", _ => process.exit(-1));
		
        let authMethod = key ? Service.AuthMethod.PrivKey : Service.AuthMethod.Pass
        let authKey = key ? key : pass
		
        return await Service.deploy({
			host: process.env.DEPLOY_HOST || cmd.host,
            user: process.env.DEPLOY_USER || cmd.user,
            authMethod,
            authKey
        }, "latest")
    })
	
	console.log (process.argv);
Program.version("1.0.0").parse(process.argv)
