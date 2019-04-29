import * as YAML from "yaml"
import * as fs from "fs";



export class Deployment {
    public image: string

    constructor() {
        this.image = ""
    }

    generate () {



        const compose = {
            version: 3,
            services: {
                main: {
                    image: this.image
                }
            }
        }

        
        const yaml =YAML.stringify (compose)
        fs.writeFileSync ("docker-compose.yml", yaml)
    }
}
