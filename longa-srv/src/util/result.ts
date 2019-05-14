import { catchErrors } from "./index"
import * as Config from "../config"

import * as fs from "fs"

/*
A general use monadic result type
Loosely modeled after Rust / F#

To make interop with various javascript apis easier, Result makes no type-level distinction between error types.
A result is either an Ok value of Type T or an Error value of some error type.
Result also makes no guarantee that the error type implement's the API's you would usually find on Exceptions
*/
export class Result<T> {
    private inner: T | any
    private isErr: boolean

    // Creates a Result in the Ok state
    static Ok<T>(value: T): Result<T> {
        return new Result(false, value)
    }

    // Creates a Result in the Err state
    static Err<T>(err: any): Result<T> {
        return new Result(true, err)
    }

    private constructor(isErr, inner: T | any) {
        this.isErr = isErr
        this.inner = inner
    }    
    
    is_ok(): boolean {
        return !this.isErr
    }
    
    is_err(): boolean {
        return this.isErr
    }
    
    // Converts the result into a nullable T
    // Useful to explicitly denote that an Err Result is not an Error in that context
    ok(): T {
        return this.isErr ? null : this.inner
    }

    // Tries to unwrap the value T contained the Result
    // If the Result is in an Err state this will cause the program to exit with an error message
    unwrap(): T {
        if (this.is_ok()) {
            return this.inner
        } // else

        console.info (this.inner.message ? this.inner.message : this.inner)

        if (process.env.RESULT_BACKTRACE) {
            console.trace()
        }

        // Try to write the error to a log file
        // Note that we wrap this in catchErrors, 
        // in case that the error log or the config file is unavailable
        catchErrors(() => {
            let config = Config.loadSync().unwrap_throw()
            fs.appendFileSync(config.logDir + "error.log",
                // We can't assume that our error type has the message field, 
                // so we fall back on the regular string representation if we have to
                this.inner.message ? this.inner.message : this.inner
            )
        }).map_err(() => {
            console.warn("Couldn't write error to error log. [Result::unwrap]")
        })

        process.exit(-1)
    }

    unwrap_throw(): T {
        if (this.is_ok()) {
            return this.inner
        }

        throw this.inner
    }

    // Maps a result of <T, E1> into a result of <T, E2> using the provided mapping function
    // For Result values in an Ok state, we map identity
    map_err(fn: (err: any) => any): Result<T> {
        if (this.isErr) {
            return Result.Err(fn(this.inner))
        }

        return Result.Ok(this.inner)
    }

    // Maps a result of <T1, E> into a result of <T2, E> using the provided mapping function
    // For Result values in an Err state, we map identity
    map_ok<F>(fn: (val: T) => F): Result<F> {
        if (this.isErr) {
            return Result.Err(this.inner)
        }

        return Result.Ok(fn(this.inner))
    }
}

