
import * as Config from "../config"
import * as child_process from "child_process"
import { catchErrors } from "../util/index"
import { Result } from "../util/result"
import * as fs from "fs"



function execute (command: string): Result<any> {
    let config = Config.loadSync ()

    let command_log = config.logDir + "command.log"
    let handle = fs.createWriteStream (command_log, {
        flags: "a"
    });

    handle.write (`${process.cwd()}:\n${command}\n\n`)

    return catchErrors (_ => child_process.execSync (command, { stdio: "inherit" }))
}


export function login(user, pass, host): Result<any> {
    let login_cmd = `docker login -u ${user} -p ${pass} ${host}`

    return execute (login_cmd)
}

export function compose_ps () {

}

export function compose_up(): Result<any> {
    return execute ("docker-compose up -d")
}

export function compose_stop() {
    return execute ("docker-compose stop")
}

export function compose_down() {
    return execute ("docker-compose down")
}