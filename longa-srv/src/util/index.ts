import { Result } from "./result"

export function catchErrors<T> (fn: (...args: any[]) => T): Result<T> {
    try {
        return Result.Ok (fn ())
    }
    catch (e) {
        return Result.Err (e.message)    
    }
}

export function workdir (nwd, cb) {
    let cwd = process.cwd()

    process.chdir (nwd)
    cb (cwd)
    process.chdir (cwd)
}