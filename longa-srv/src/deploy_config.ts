import * as fs from "fs"
import * as util from "util"

import { Result } from "./util/result"

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

export function load (): Result<Config> {
    const path = process.cwd() + "/longa.config.json"

    try {
        const configFile = fs.readFileSync(path, "utf-8")
        return Result.Ok(JSON.parse(configFile))
    }
    catch {
        return Result.Err("A deployment config file could not be found.")
    }
}

export async function store (config: Config): Promise<void> {
    const write = util.promisify(fs.writeFile)

    const path = "./longa.config.json";

    write (path, JSON.stringify(config, null, 4))
}