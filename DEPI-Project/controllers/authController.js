const userModel = require('./../models/userModel');
const catchAsync =require('./../utils/catchAsync');
const AppError =require('../utils/appError');
const crypto = require('crypto');
const {promisify} =require('util')
const jwt =require('jsonwebtoken')
const Email =require('./../utils/email');


const signToken =(id)=>{
    return jwt.sign({id } ,process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user , status , res)=>{
    const token =signToken(user.id);
    const cookieOptions ={
        expires :new Date (Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV ==='production'){
        cookieOptions.secure =true;
    }
    res.cookie('jwt' ,token ,cookieOptions);
    

    user.password =undefined //in order not to appear in respnose
    res.status(status).json({
        "status": "success",
        token,
        "data": {user}
    })

}
exports.singup =catchAsync(async (req , res , next) =>{
    const newUser = await userModel.create({
        "name" :req.body.name ,
        "email" :req.body.email,
        "password" :req.body.password,
        "passwordConfirm" :req.body.passwordConfirm,
        "photo" :req.body.photo,
        "changedPassword" :req.body.changedPassword,
        "role":req.body.role
    },);

   // await new Email(newUser ,`${req.protocol}://${req.get('host')}/me`).sendWelcome();

    createSendToken(newUser , 201 ,res);
})

exports.signin =catchAsync(async(req ,res ,next)=>{
    const {email , password} =req.body;

    if( !email || !password){
        return next(new AppError('You must provide a valid email and password',400) );
    }

    const user = await userModel.findOne({email}).select('+password');
    console.log(user);
    

    if(!user || !await user.correctPassword(password ,user.password)){
        next(new AppError('Incorrect email or password',401));
    }

    createSendToken(user ,200 ,res);
})


exports.protect =catchAsync(async (req ,res , next)=>{
    // 1) Getting token and check of it's there
    let token ;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token =req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.jwt){
        token=req.cookies.jwt;
    }
    
    if(!token){
        return next(new AppError('You are not logged in ! Please login to access',401));
    }
    /* console.log(token); */


    // 2) Verification token
    const decode = await promisify(jwt.verify)(token ,process.env.JWT_SECRET);
    /* console.log(decode); */

    //Note after deleting user or changing his password the token still valid and you should handle these cases
    // 3) Check if user still exists
    const currentUser = await userModel.findById(decode.id);
    if(!currentUser){
        next(new AppError('User belong to the token dose not exist !' ,401));
    }
    // 4) Check if user changed password after the token was issued
    if(currentUser.changePasswordAfter(decode.iat)){
        next(new AppError('User recently changed password! Please log in again',401));
    }

    req.user=currentUser;
    res.locals.user=req.user;
    next();
})

//for render pages
exports.isLoggedIn = async (req ,res , next)=>{
    let token ;
    if(req.cookies.jwt){
        try{
            token=req.cookies.jwt;
            const decode = await promisify(jwt.verify)(token ,process.env.JWT_SECRET);
            const currentUser = await userModel.findById(decode.id);
            if(!currentUser){
                return next()
            }
            if(currentUser.changePasswordAfter(decode.iat)){
                return next();
            }
            //locals is as container contain variables avaliable for template
            req.user=currentUser;
            res.locals.user=currentUser;
            return next();
        }
        catch(err){
            return next();
        }

    }
    next();
}
exports.logout =(req , res)=>{
    const cookieOptions ={
        httpOnly:true,
        expires:new Date(Date.now()+10*1000)
    }
    res.cookie('jwt' ,'loggedout' ,cookieOptions);
    res.status(200).json({status:'success'});
}




exports.restrictTo =(...roles)=>{
    return(catchAsync(async (req , res, next)=>{
        if(!roles.includes(req.user.role)){
            next(new AppError('You do not have permission to perform this action',403));
        }
        next();

    }))
}


exports.forgotPassword =catchAsync(async(req ,res , next)=>{
    //1)Get user based on posted email
    const user = await userModel.findOne({email :req.body.email});
    if(!user){
        return next(new AppError('The user is not found' ,404));
    }

    //2)Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3)send resetToken to user email
    try{
    const resetURL =`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user ,resetURL).resetPassword();
    res.status(200).json({
        status : 'success',
        message:'Token sent to email'
    })
    }
    catch(err){
        this.passwordResetToken =undefined;
        this.passwordResetExpires=undefined;
        await user.save();
        next(new AppError('There was an error sending email' ,500));
    }

})


exports.resetPassword =catchAsync(async (req ,res , next)=>{
    //1)Get user based on token
    const hashToken =crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(hashToken);
    const user = await userModel.findOne({passwordResetToken :hashToken ,passwordResetExpires :{$gt:Date.now()}});
    if(!user){
        return next(new AppError('Token is invalid or has expired' ,400));
    }
    //2) If there is a user and his token not expired 
    user.password = req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetExpires =undefined;


    //3)updata changepasswordAt property
    //sometimes a token is created before chaning password timestamp has been created
    user.changedPassword=Date.now() - 1000;

    
    await user.save();
    //4)log user in new jwt
    createSendToken(user ,201 ,res);
})


exports.updatePassword =catchAsync(async(req ,res ,next)=>{
    //1)Get user from collection 
    const user = await userModel.findById(req.user._id).select('+password');
    //2)check is the password is correct
    if(!(await user.correctPassword(req.body.currentPassword ,user.password))){
        return next(new AppError('Your current password is wrong' ,401));
    }
    //3)updata the password
    user.password =req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.changedPassword =Date.now();
    await user.save();

    //4)log user in (send new jwt)
    createSendToken(user ,201 , res);
})