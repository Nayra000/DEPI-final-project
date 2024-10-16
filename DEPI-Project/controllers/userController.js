const userModel = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync') ;
const AppError  =require('./../utils/appError');

const factory = require('./factoryController');
const multer =require('multer');
const sharp = require('sharp');



const filterObj =(obj ,...allowedFields)=>{
    let newObj ={};
    Object.keys(obj).forEach(e =>{
        if(allowedFields.includes(e)){
            newObj[e]=obj[e];
        }
    })
    return newObj;
}
/* const mutlerStorage = multer.diskStorage({
    destination:(req , file ,cb)=>{
        cb(null ,'public/img/users');
    },
    filename :(req , file ,cb)=>{
        const ext =file.mimetype.split('/')[1];
        cb(null ,`user-${req.user.id}-${Date.now()}.${ext}`);
    }
}); */
const multerStorage =multer.memoryStorage();

const multerFilter =(req , file ,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null ,true);
    }
    else{
        cb(new AppError('Not An image ! please upload only image' ,400),false);
    }
}
const upload =multer(
    {
        storage :multerStorage ,
        fileFilter:multerFilter
    }
)
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req , res , next)=>{
    if(!req.file){
        return next();
    }
    req.file.filename =`user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer).resize(500 ,500).toFormat('jpeg').jpeg({quality: 80}).toFile(`public/img/users/${req.file.filename}`);
    next();
})


exports.getAllUsers =factory.getAll(userModel);
exports.getSingleUser =factory.getSingleOne(userModel);




exports.createNewUser =(req,res)=>{
    res.status(500).json({
        "statuts" :"Go to sign up route",
        "timeRequest" :req.requestTime,
        data:null
    })
}

exports.updateMe=catchAsync(async(req ,res ,next)=>{
     // 1) Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This is route is not for password upadates' ,400));
    }

    //2)filter body
    const filteredBody = filterObj(req.body ,'name' ,'email');
    filteredBody.photo =req.file.filename;
    /* console.log(req.file);
    console.log(req.body); */ 

    //3)updating
    const user =await userModel.findByIdAndUpdate({_id:req.user.id} ,filteredBody, {
        new :true,
        runValidators :true
    })

    res.status(200).json({
        "status": "success",
        "data":{user}
    })

})

exports.deleteMe =catchAsync(async(req , res, next)=>{
    await userModel.findByIdAndUpdate({_id : req.user.id} ,{active :false});
    res.status(204).json({
        "status": "success",
    })

})

exports.getMe =(req , res , next)=>{
    req.params.id =req.user.id;
    console.log(req.params.id);
    next();
}



exports.updateUser =factory.updateOne(userModel);
exports.deleteUser = factory.deleteOne(userModel);


