class ApiResponse {
    constructor(
        statusCode,
        data,
        message,
        success
    ){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400 // if status code is below 400 success is true, else false
    }
}

export {ApiResponse}