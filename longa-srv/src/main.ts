#!/usr/bin/env node

/* Contains the CLI interface to the service */


import * as Program from "commander";
import { exec } from "child_process";

import * as Config from "./config";

import * as Service from "./service";

Program.command("ls, list")
.action(cmd => {
	Service.list_instances()
})

Program.command("config")
	.action(async cmd => {
		console.log(await Config.load())
	})

Program.command("install")
	.action(async cmd => {
		console.log(Service);
		
		await Service.install()
	})

Program.command ("deploy <image> <name> -- [env...]")
	.option("--context <workdir>", "")
	.description("Deploys the image given by <image> under the name <name>.")
	.action(async (image, name, env, cmd) => {
		if (cmd.context) process.chdir (cmd.context)

		console.info (env)

		await Service.deploy (image, name, env)
	})

Program.command ("stop <name>")
	.action(async (name, cmd) => {
		await Service.stop (name)
	})

Program.command ("remove <name>") 
	.action(async (name, cmd) => {
		await Service.remove (name)
	})

Program.version("1.0.3").parse(process.argv);
