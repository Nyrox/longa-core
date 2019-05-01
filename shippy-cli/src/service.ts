import * as CliTools from "./cli";
import * as Config from "./config";

import * as child_process from "child_process";
import * as sequest from "sequest";


export interface Registry {
    user: string
    pass: string
    host: string
}

export interface Context {
    registry: Registry
}

function get_qualified_image_name(host, group, project, imageName = null, tag = "latest") {
    let base = `${host}/${group}/${project}`;

    return imageName ?
        base + `/${imageName}:${tag}` : base + `:${tag}`
}

function login({ host, user, pass }: Registry) {
    if (
        !CliTools.insist(
            user,
            "Please supply a registry username through cli parameters or environment variables"
        ) ||
        !CliTools.insist(
            pass,
            "Please supply a registry password through cli parameters or environment variables"
        )
    ) {
        return false
    }

    const re = /((\w+):\/\/)?([\w\.]+)(:(\d+))?/
	
	const matches = re.exec (host)
	
	const protocol = matches[1]
	let hostname = matches[3]
	const port = matches[5]

    if (process.env.CI_REGISTRY) {
        hostname = process.env.CI_REGISTRY
    }

    let login_command = `docker login -u ${user} -p ${pass} ${hostname}`

    console.info(login_command);
    child_process.execSync(login_command, { stdio: "inherit" });

    return true
}

export function publish(imageName = null, tag, context: Context) {
    if (!login(context.registry)) { return false }

    const config = Config.load()

    let registry = config.registry;
    let project = config.project;

    let image = get_qualified_image_name(registry.host, project.group, project.name, imageName, tag)
    let publish_command = `docker push ${image}`;

    console.info(publish_command);
    child_process.execSync(publish_command, { stdio: "inherit" })

    return true;
}

export enum AuthMethod {
    Pass,
    PrivKey
}

interface ConnectionSettings {
    host: string
    user: string
    
    authMethod: AuthMethod
    authKey: string
}

export function deploy (conn: ConnectionSettings, image) {
    const config = Config.load()

    let client = sequest.connect(`${conn.user}@${conn.host}`, {
        password: conn.authMethod == AuthMethod.Pass ? conn.authKey : null,
        privateKey: conn.authMethod == AuthMethod.PrivKey ? conn.authKey : null
    });

    client("ls -al", function (e, stdout) {
        console.log(stdout.split('\n'));
        client.end();
    })
}