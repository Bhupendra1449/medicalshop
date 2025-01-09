class ApiError extends Error {
    constructor(
        StatusCode,
        message = "Something Went Wrong",
        errors = [],
        statck = ""
    ) {
        super(message)
            this.StatusCode = StatusCode
            this.data= null
            this.message=message
            this.success = false;
            this.errors = errors

            if(statck){
                this.stack = statck
            }else{
                Error.captureStackTrace(this, this.constructor)
            }
        
    }
}
export {ApiError}