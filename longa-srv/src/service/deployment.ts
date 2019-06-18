import * as YAML from "yaml"
import * as fs from "fs";



export class Deployment {
    public image: string
    public env_params: []

    constructor() {
        this.image = ""
    }

    generate () {



        const compose = {
            version: "3.7",
            services: {
                main: {
                    image: this.image,
                    environment: this.env_params,
                    network_mode: "bridge"
                }
            },
        }

        
        const yaml = YAML.stringify (compose)
        fs.writeFileSync ("docker-compose.yml", yaml)
    }
}
