const success = (statusCode, result) => {
    return {
        status: "ok",
        statusCode,
        result
    }
}
const error = (statusCode, message) => {
    return {
        status: "failed",
        statusCode,
        message
    }
}

export {
    success,
    error
}