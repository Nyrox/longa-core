import * as fs from "fs";
import * as util from "util";
import * as path from "path";


export const DEFAULT_PATH = "/etc/shippyd/config.json";

interface Config {

}

export async function load () : Promise<Config> {
	const read = util.promisify(fs.readFile);

	let configFile = await read(DEFAULT_PATH, "utf-8").catch(_ => {
		console.warn("Unable to find configuration file. Use the 'init' command to create one interactively.");
		return process.exit(-1)		
	})

	return JSON.parse(configFile);
}

export function exists () : boolean {
	return fs.existsSync (DEFAULT_PATH)
}

export async function store (config: Config) : Promise<void> {
	const write = util.promisify(fs.writeFile);

	if (!fs.existsSync(path.dirname(DEFAULT_PATH))) {
		fs.mkdirSync (path.dirname(DEFAULT_PATH), {recursive: true});
	}

	write (DEFAULT_PATH, JSON.stringify(config))
}