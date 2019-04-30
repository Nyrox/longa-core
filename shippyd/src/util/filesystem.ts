import { Result } from "./result"
import { catchErrors } from "./index"

import * as fs from "fs"
import { promisify } from "util"

export function existsSync (path: fs.PathLike): Result<boolean> {
    return catchErrors (_ => fs.existsSync(path)) 
}

export function readFileSync (path: fs.PathLike, encoding: string): Result<string> {
    return catchErrors (_ => fs.readFileSync(path, encoding))
}