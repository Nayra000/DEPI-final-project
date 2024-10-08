const AppError =require('./../utils/appError');

const handelCastErrorDB =(error)=>{
    return new AppError(`Invalid ${error.path} :${error.value}` ,400);
}

const handelDuplicateErrorDB =(error)=>{
    const value =error.keyValue.name;
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new AppError(message ,400);
}

const handelValidationErrorDB =(error)=>{
    const errors =Object.values(error.errors).map((el) =>el.message);
    return new AppError(`Invalid input data  ${errors.join('. ')}`,400);
}

const handelJWTError =()=>new AppError('Invalid token! please sing in again' ,401);

const handelJWTExpiredError =()=>{new AppError('Your token has expired! Please log in again.', 401)}
const sendErrorProd  =(err ,req ,res)=>{
    if(err.isOperational){
        if(req.originalUrl.startsWith('/api')){
            return res.status(err.statusCode).json({
                "status": err.status,
                "message": err.message,
            })
        }
        else{
            return res.status(err.statusCode).render('error' ,{title :'Not found' ,msg :err.message});
        }
    }
    else{
        if(req.originalUrl.startsWith('/api')){
            console.error(err);
            return res.status(500).json({
                "status": "Error",
                "message": err.message,
            })
        }
        else{
            return res.status(err.statusCode).render('error' ,{title :'Not found' ,msg :'Something went wrong'});

        }
    }

};

const sendErrorDev =(err , req,res)=>{
    
    if(req.originalUrl.startsWith('/api')){
        return res.status(err.statusCode).json({
            "status": err.status,
            "message": err.message,
            "error":err,
            "stack" :err.stack
        })
    }
    return res.status(err.statusCode).render('error' ,{ title: 'Something went wrong!',msg: err.message})

}




module.exports =(err ,req ,res ,next)=>{
    err.status = err.status || 'error';
    err.statusCode =err.statusCode ||500;
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err ,req ,res);
    }
    else if(process.env.NODE_ENV === 'production'){
        /* let error ={... err}; */
        /* let error =Object.assign({} ,err);  */
        /*
        these copying techniques create a new object and copy the enumerable 
        own properties from the source object to the new object, but they do 
        not copy the prototype reference.
        */
        let error = Object.create(err);
        if(error.name === "CastError"){
            error =handelCastErrorDB(error);
        }
        else if(error.code === 11000){
            error = handelDuplicateErrorDB(error);
        }
        else if(error.name === 'ValidationError'){
            error =handelValidationErrorDB(error);
        }
        else if(error.name === 'JsonWebTokenError'){
            error =handelJWTError();
        }
        else if(error.name === 'TokenExpiredError'){
            error =handelJWTExpiredError();
        }
        sendErrorProd(error ,req,res);
    }   

}