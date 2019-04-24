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
		Service.install()
	})

Program.command ("deploy <image> <name>")
	.description("Deploys the image given by <image> under the name <name>.")
	.action(async cmd => {

	})

Program.version("1.0.0").parse(process.argv);
