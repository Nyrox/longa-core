#!/usr/bin/env node


import * as Program from "commander";
import { exec } from "child_process";


Program.command("ls, list", "List's currently running applications")
.action(cmd => {
	exec("ls");
	console.log("LS DONE");
});


Program.version("1.0.0").parse(process.argv);