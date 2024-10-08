class AppError extends Error{
    constructor(message , statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status =`${statusCode}`.startsWith('4') ?'fail' :'error';
        this.isOperational = true;

        //to capture the stack trace at the moment the Error object is created and attach
        // it to the error object itself.
        Error.captureStackTrace(this , this.constructor);
    }
}

module.exports = AppError;