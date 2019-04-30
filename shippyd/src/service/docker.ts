
import * as Config from "config"
import * as child_process from "child_process"

function log_command (cmd) {
	
}


export function compose_ps () {

}

export function compose_up() {


    child_process.execSync("docker-compose up -d", { stdio: "inherit" });
}