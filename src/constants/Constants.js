module.exports={
    ERRORCODES: {
    OK: 200,
    NEW_RESOURCE_CREATED: 201,
    ALREADY_EXIST: 225,
    DOES_NOT_EXIST: 227,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INVALID: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    PASSWORD_NOT_SET: 410,
    LENGTH_REQUIRED: 411,
    MUST_BE_NUMBER: 415,
    TABLE_NOT_FOUND: 418,
    SESSION_EXPIRED: 440,
    INTERNAL_SERVER_ERROR: 500,
    SOMETHING_WENT_WRONG: 503,
    GATE_WAY_TIMEOUT: 504,
    },
    NUMBERS: {
        ONE: 1,
        ZERO: 0,
        LIMIT: 10,
        NEGATIVE_ONE: -1
    },
    STATUS_MESSAGES: {
        UPLOAD_FILE: "Please upload a file!",
        POST_UPLOADED: "post uploaded successfully",
        PAGINATION: "current page value should be positive",
        CANNOT_DOWNLOAD: "Cannot download the video!",
        COMMENT: "add comment successfully",
        IMAGE_REQUIRED:"imageId is required" ,
        IMAGE_NOT_FOUND:"Image not found" ,
        INVALID_IMAGE:"Invalid imageId",
        LIKE_IMAGE:"Image liked successfully",
        COMMENT_REQUIRED:"Comment is required",
        NO_RECORDS:"No records found",
        UNAUTHORIZED:"Unauthorized",
        UNDEFINED:"undefined" 
    },
    STATUS:{
        FALSE: false,
        TRUE: true
    },
    ERROR_MESSAGES: {
        INTERNAL_SERVER_ERROR: "Internal server error",
    },
    POSTS:{
    POST_ID_AND_REPLY:"Post ID and reply are required",
    REPLY_ADDED:"Reply added successfully",
    FAILED_TO_ADD_REPLY:"Failed to add reply",
    ONLY_ADMINS:"Only admins can reply to posts",
    ERROR_REPLY: "An error occurred while replying to the post",
    ADMIN: "Reach.HR@bilvantis.io",
    SUGGESTIONS:"suggestions",
    BUG:"bug",
    ACTIVE:"true",
    INACTIVE:"false",
    UNDEFINED:undefined
    }
}