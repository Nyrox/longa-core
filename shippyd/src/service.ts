
/* Contains the entry points for the actual service itself */

import * as inquirer from "inquirer";


import * as Config from "./config";


export async function setup() {
	if (Config.exists()) {
		const prompt = await inquirer.prompt([
			{
				type: "confirm",
				name: "continue",
				message: "There already exists a config for shippy. Are you sure you want to override it?",
				default: false
			}
		])

		if (prompt.confirm == false) process.exit(0);
	}

	const answers = await inquirer.prompt([
		{
			name: "applicationDir",
			message: "Where do you want shippy to store the application settings/hooks/configs?",
			default: "/var/shippyd/applications/"
		},
		{
			name: "dataDir",
			message: "Where do you want shippy to store application data (volumes)?",
			default: "/var/shippyd/appdata/"
		},
		{
			name: "registry.host",
			message: "Please enter the hostname of your docker registry to pull images from."
		},
		{
			name: "registry.user",
			message: "Please enter the user used to pull from the registry."
		},
		{
			name: "registry.pass",
			message: "Please enter the token used to pull from the registry."
		}
	])
	
	await Config.store (answers)
	
	console.info("Setup successful! You can now start using shippy. :)")
}