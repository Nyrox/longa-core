#!/usr/bin/env node

/* Contains the CLI interface to the service */


import * as Program from "commander";
import { exec } from "child_process";

import * as Config from "./config";

import * as Service from "./service";


Program.command("ls, list")
.action(cmd => {
	exec("ls");
	console.log("LS DONE");
})

Program.command("config")
	.action(async cmd => {
		console.log(await Config.load())
	})

Program.command("init")
	.action(cmd => {
		Service.setup()
	})
	
Program.version("1.0.0").parse(process.argv);