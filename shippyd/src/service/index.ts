
/* Contains the entry points for the actual service itself */

import * as inquirer from "inquirer";


import * as Config from "../config";
import * as fs from "fs";
import * as path from "path";

export async function install() {
	if (Config.exists()) {
		console.error("A config file for shippyd already exists. Exiting...");
		process.exit(-1);
	}

	console.info ("Installing...");

	const DEFAULT_CONFIG: Config.Config = {
		applicationDir: "/var/shippyd/applications/",
		dataDir: "/var/shippyd/appdata/",
		authDir: "/etc/shippyd/credentials/"
	}

	// Create the needed directories
	console.info("Creating directories...");

	try {
		fs.mkdirSync (Config.CONFIG_DIR, {recursive: true});
		fs.mkdirSync (DEFAULT_CONFIG.applicationDir, {recursive: true})
		fs.mkdirSync (DEFAULT_CONFIG.dataDir, {recursive: true});
		fs.mkdirSync (DEFAULT_CONFIG.authDir, {recursive: true});
	} catch (e) {
		console.error (e.message)
		process.exit(-1);
	}

	// Store our config
	console.info("Storing configuration file...");
	await Config.store(DEFAULT_CONFIG)

	console.info ("Installation finished!");
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



