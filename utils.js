const httpStatus = require("http-status");
const constants = require("./src/constants/Constants");

exports.handleException = (statusCode,message,res) => {
    const error = {
        errorcode: statusCode,
        message: message
    };
    res.status(statusCode).send(error);
};
exports.exception = (res) => {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message =  constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    exports.handleException(statusCode,message,res);
};

exports.getAdjustedCurrentDate = () => {
    const currentDate = new Date(); 
    currentDate.setHours(currentDate.getHours() + 5); 
    currentDate.setMinutes(currentDate.getMinutes() + 30); 
    return currentDate; 
};
