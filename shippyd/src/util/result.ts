




export class Result<T> {
    private inner: T | any
    private isErr: boolean

    static Ok<T> (value: T): Result<T> {
        return new Result (false, value)
    }

    static Err<T> (err: any): Result<T> {
        return new Result (true, err)
    }

    private constructor (isErr, inner: T | any) {
        this.isErr = isErr
        this.inner = inner
    }

    unwrap (): T {
        if (this.isErr) {
            console.error(this.inner)

            if (process.env.RESULT_BACKTRACE) {
                console.trace()
            }

            process.exit(-1)
        }
        else {
            return this.inner
        }
    }
}

