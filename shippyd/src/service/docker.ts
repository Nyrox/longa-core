
import * as Config from "config"
import * as child_process from "child_process"
import { catchErrors } from "../util/index"
import { Result } from "../util/result"

function log_command (cmd) {
	
}

export function login(user, pass, host): Result<any> {
    let login_cmd = `docker login -u ${user} -p ${pass} ${host}`

    return catchErrors(_ => child_process.execSync (login_cmd, { stdio: "inherit" }))
}

export function compose_ps () {

}

export function compose_up(): Result<any> {
    
    return catchErrors(_ =>
        child_process.execSync("docker-compose up -d", { stdio: "inherit" })
    )
}

export function compose_stop() {
    child_process.execSync("docker-compose stop", { stdio: "inherit" })

}

export function compose_down() {
    child_process.execSync("docker-compose down", { stdio: "inherit" })
}