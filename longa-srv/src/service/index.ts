
/* Contains the entry points for the actual service itself */

import * as inquirer from "inquirer";


import * as Config from "../config";
import * as DeployConfig from "../deploy_config"

import { Deployment } from "./deployment"

import * as fs from "fs";
import * as path from "path";
import * as Docker from "./docker";
import { workdir } from "../util/index";

export async function install() {
	if (Config.exists()) {
		console.error("A config file for longa-srv already exists. Exiting...");
		process.exit(-1);
	}

	console.info ("Installing...");

	const DEFAULT_CONFIG: Config.Config = {
		applicationDir: "/var/longa-srv/applications/",
		dataDir: "/var/longa-srv/appdata/",
		authDir: "/etc/longa-srv/credentials/",
		logDir: "/var/log/longa-srv/"
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

import { URL } from "url"
import * as filesystem from "../util/filesystem"
import * as ini from "ini"
import { Result } from "../util/result"

async function login (host: string): Promise<Result<any>> {
	const re = /((\w+):\/\/)?([\w\.]+)(:(\d+))?/
	
	const matches = re.exec (host)
	console.log(matches);
	
	const protocol = matches[1]
	const hostname = matches[3]
	const port = matches[5]

	let config = await Config.load()
	let credentials_file = config.authDir + hostname

	if (filesystem.existsSync (credentials_file).unwrap()) {
		let cred = ini.parse(filesystem.readFileSync(credentials_file, "utf-8").unwrap())
		
		// Note that we use the full host part here, not just the hostname
		// This is to ensure hosts with explicit protocol or port restrictions continue working
		return Docker.login (cred.user, cred.pass, host)
	}
	else {
		return Result.Err (`No credentials file for host ${hostname}`)
	}
}

export async function deploy (image, name, env_params) {
	let config = await Config.load()
	let deploy = await DeployConfig.load().unwrap()

	let appdir = `${config.applicationDir}${name}/`

	console.info (`Deploying to config dir: ${appdir}`);
	
	// Check if we can login to the registry
	(await login (deploy.registry.host))
		.map_err (e => `Login failed with error: ${e}`)	
		.unwrap()
	
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
			"",
			"latest"
		)

		deployment.env_params = env_params

		deployment.generate()	

		Docker.compose_up ()
	}
}

export async function stop (name) {
	let config = await Config.load()
	let appdir = `${config.applicationDir}${name}/`
	
	if (!fs.existsSync (appdir)) {
		console.info (`Deployment ${name} could not be found`)
		process.exit(-1)
	}

	process.chdir (appdir)
	return Docker.compose_stop()
}

export async function remove (name) {
	let config = await Config.load()
	let appdir = `${config.applicationDir}${name}/`


	await stop (name)

	workdir (appdir, () => Docker.compose_down())
	
	fs.unlinkSync (appdir + "longa.config.json")
	fs.unlinkSync (appdir + "docker-compose.yml")
	fs.rmdirSync (appdir)
	
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



