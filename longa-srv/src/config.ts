import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import { Result } from "./util/result"

import * as filesystem from "./util/filesystem"



export const CONFIG_DIR = "/etc/longa-srv/";
export const DEFAULT_PATH = CONFIG_DIR + "longa-srv.json";

export interface Config {
	applicationDir: string
	dataDir: string
	authDir: string
	logDir: string
}


export async function load () : Promise<Config> {
	const read = util.promisify(fs.readFile);

	let configFile = await read(DEFAULT_PATH, "utf-8").catch(_ => {
		console.warn("No config file for longa found. Aborting...")
		return process.exit(-1)
	})

	return JSON.parse(configFile);
}

export function loadSync(): Result<Config> {
	return filesystem.readFileSync (DEFAULT_PATH, "utf-8")
		.map_ok(JSON.parse)
}

export function exists () : boolean {
	return fs.existsSync (DEFAULT_PATH)
}

export async function store (config: Config) : Promise<void> {
	const write = util.promisify(fs.writeFile);

	if (!fs.existsSync(path.dirname(DEFAULT_PATH))) {
		fs.mkdirSync (path.dirname(DEFAULT_PATH), {recursive: true});
	}

	write (DEFAULT_PATH, JSON.stringify(config, null, 4))
}
