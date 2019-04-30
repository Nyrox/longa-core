
/* Contains the entry points for the actual service itself */

import * as inquirer from "inquirer";


import * as Config from "../config";
import * as DeployConfig from "../deploy_config"

import { Deployment } from "./deployment"

import * as fs from "fs";
import * as path from "path";
import * as Docker from "service/docker";

export async function install() {
	if (Config.exists()) {
		console.error("A config file for shippyd already exists. Exiting...");
		process.exit(-1);
	}

	console.info ("Installing...");

	const DEFAULT_CONFIG: Config.Config = {
		applicationDir: "/var/shippyd/applications/",
		dataDir: "/var/shippyd/appdata/",
		authDir: "/etc/shippyd/credentials/",
		logDir: "/var/log/shippyd/"
	}

	// Create the needed directories
	console.info("Creating directories...");

	try {
		fs.mkdirSync (Config.CONFIG_DIR, {recursive: true});
		fs.mkdirSync (DEFAULT_CONFIG.applicationDir, {recursive: true})
		fs.mkdirSync (DEFAULT_CONFIG.dataDir, {recursive: true});
		fs.mkdirSync (DEFAULT_CONFIG.authDir, {mode: 0o700, recursive: true});
		fs.mkdirSync (DEFAULT_CONFIG.logDir, {recursive: true})
	} catch (e) {
		console.error (e.message)
		process.exit(-1);
	}

	// Store our config
	console.info("Storing configuration file...");
	await Config.store(DEFAULT_CONFIG)

	console.info ("Installation finished!");
}

export async function deploy (image, name) {
	let config = await Config.load()
	let deploy = await DeployConfig.load().unwrap()

	let appdir = `${config.applicationDir}${name}/`

	console.info (`Deploying to config dir: ${appdir}`)
	
	// Check if the deployment already exists
	if (fs.existsSync (appdir)) {
		// Shutdown, Rebuild and Deploy
		process.chdir (appdir)
	}
	else {
		// Deploy newly
		fs.mkdirSync (appdir)

		process.chdir (appdir)
		DeployConfig.store (deploy)

		let deployment = new Deployment ()
		deployment.image = get_qualified_image_name(
			deploy.registry.host,
			deploy.project.group,
			deploy.project.name,
			image,
			"latest"
		)

		deployment.generate()

		Docker.compose_up ()
	}
}


function get_qualified_image_name(host, group, project, imageName = null, tag = "latest") {
    let base = `${host}/${group}/${project}`;

    return imageName ?
        base + `/${imageName}:${tag}` : base + `:${tag}`
}

export async function list_instances() {
	let config = await Config.load()

	fs.readdirSync (config.applicationDir, { withFileTypes: true }).forEach((dirEnt, i) => {
		if (dirEnt.isDirectory()) {
			console.info(dirEnt.name);
			// @TODO: Implement docker compose status check
		}
	})
}



