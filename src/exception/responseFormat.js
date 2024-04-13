
function validationResponse(statusCode, message) {
    return {
        statusCode: statusCode,
        message: message
    };
}

function successResponse(statusCode,message,data) {
    return {
        statusCode: statusCode,
        message: message,
        data:data
    }
}

function errorResponse() {
    return {
        statusCode: 500,
        message: "Internal Server Error"
    };
}

module.exports ={
    validationResponse,
    successResponse,
    errorResponse
}