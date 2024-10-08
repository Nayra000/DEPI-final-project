const bcrypt =require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const crypto =require('crypto');
const userSchema = new mongoose.Schema({
    "name" :{
        type: String ,
        trim: true,
        required:[true ,'The name of the user must be required'],
        minlength :[3 ,'The minimum number of characters is 3'],
        maxlength:[30 ,'The maximum number of characters is 30']
    }
    ,"email" :{
        type: String ,
        unique:[true ,'The email must be unique'],
        required:[true ,'The name of the user must be required'],
        validate :[validator.isEmail ,'The email is not valid']
    }
    ,"photo" :{
        type: String ,
        default :'default.jpg'
    } ,
    "role" :{
        type :String ,
        enum :['user', 'guide', 'lead-guide', 'admin'] ,
        default :'user'
    },
    "password" :{
        type :String ,
        require :[true ,'The password is required'] ,
        minlength:8,
        select :false
    }
    ,"passwordConfirm" :{
        type :String ,
        require :[true ,'The password is required'] ,
        validate:{
            //only work for .save() .create()
            validator :function(val) {
                return val === this.password
            } ,
            message :'The password confirm must match the password'
        } 

    },
    "changedPassword" :Date ,
    "passwordResetToken":String ,
    "passwordResetExpires" :Date,
    "active" :{
        type:Boolean ,
        default:true ,
        select :false
    }
})
userSchema.pre('save' ,async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password =await bcrypt.hash(this.password ,12);
    this.passwordConfirm =undefined ;

})
userSchema.pre(/^find/ ,function(next){
    this.find({active :{$ne :false}});
    next();
})

userSchema.methods.correctPassword =async function(canidatePassword , userPasswrd){
    return await bcrypt.compare(canidatePassword ,userPasswrd);
}
userSchema.methods.changePasswordAfter=function(tokenTimeStamp){
    
    if(this.changedPassword){
        const intTimeStamp =parseInt(this.changedPassword.getTime())/1000;
        /*  console.log(intTimeStamp) ;
        console.log(tokenTimeStamp) ; */
        return  intTimeStamp  >tokenTimeStamp;
    }

    return false;
}

userSchema.methods.createPasswordResetToken =function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    console.log({resetToken} ,this.passwordResetToken);
    this.passwordResetExpires =Date.now()+10 *60*1000;

    return resetToken;
}
const User = new mongoose.model('User' ,userSchema);

module.exports =User;