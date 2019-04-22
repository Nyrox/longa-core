import * as fs from "fs";

interface Config {
	dockerfile: string
	project: {
		name: string
		group: string
	}
	registry: {
		host: string
	}
}


export function load (): Config {
	const path = process.cwd() + "/shippy.config.json";
	
	try {
		const configFile = fs.readFileSync(path, "utf-8");
		return JSON.parse(configFile)
	}
	catch {
		return null;
	}
}
