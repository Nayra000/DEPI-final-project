const AppError = require('../utils/appError');
const tourModel =require('./../models/tourModel');
const catchAsync =require('./../utils/catchAsync');
/* const AppError  =require('./../utils/appError'); */
const multer =require('multer');
const sharp = require('sharp');

const factory = require('./factoryController');

exports.aliasTopTours =(req ,res ,next)=>{
    req.query.sort= '-ratingsAverage,price';
    req.query.limit='5';
    req.query.fields='name,price,ratingsAverage,price,description';
    next();
}




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

exports.uploadTourImages =upload.fields([
    {
        name:'imageCover' ,maxCount:1
    },
    {
        name:'images' ,maxCount:3
    }
])

exports.resizeTourImages = catchAsync(async (req , res , next)=>{
    if(!req.files){
        return  next();
    }
    //image Cover

    req.body.imageCover =`tour-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.files.imageCover[0].buffer)
    .resize(2000 ,1333)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/img/tours/${req.body.imageCover}`);



    //images
    req.body.images = [];
    
    await Promise.all( req.files.images.map(async (file ,index)=>{
        const fileName =`tour-${req.params.id}-${Date.now()}-${index+1}.jpeg`;
        await sharp(file.buffer)
        .resize(2000 ,1333)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/img/tours/${fileName}`);

        req.body.images.push(fileName);
    }))
    
    next();

})

exports.getAllTours =factory.getAll(tourModel);
exports.getSingleTour =factory.getSingleOne(tourModel , {path :'reviews'});
exports.createNewTour= factory.createOne(tourModel);
exports.updateTour = factory.updateOne(tourModel);
exports.deleteTour =factory.deleteOne(tourModel);


exports.tourStates =catchAsync (async (req , res ,next)=>{
    const states = await tourModel.aggregate(
        [
            {
                $match :{ ratingsAverage: {$gte :4.5}}
            },
            {
                $group :{
                    _id:{ $toUpper:"$difficulty"},
                    numTours :{$sum :1} ,
                    numRatings :{$sum :'$ratingsQuantity'} ,
                    avgRating :{$avg :'$ratingsAverage'},
                    avgPrice :{$avg :'$price'},
                    minPrice:{$min :'$price'},
                    maxPrice:{$max :'$price'}
                }
            },
            {
                $sort :{avgPrice :-1}
            }
            ,{
                $match :{_id :{$ne :"EASY"}}
            }
        ]
    )
    res.status(200).json({
        "status" :"success",
        states
    })
})

exports.getMonthlyPlane =catchAsync(async(req ,res ,next)=>{
    const year =req.params.year *1;
    const plane = await tourModel.aggregate(
        [
            { 
                $unwind :"$startDates"
            },
            {
                $match :{startDates :{$gte :new Date(`${year}-1-1`) , $lte :new Date(`${year}-12-31`)}}
            },
            {
                $group :{
                    _id :{$month :"$startDates"} ,
                    numTours :{$sum :1},
                    tours :{$push :"$name"}
                }
            },
            {
                $addFields:{'month' :'$_id'}
            },
            {
                $project:{_id:0}
            },
            {
                $limit:5
            }
        ]
    )
    res.status(200).json({
        "status" :"success",
        plane
    })
})



exports.getToursWithin =catchAsync(async(req ,res ,next)=>{
    const {distance ,latlng , unit} =req.params;
    const [lat ,lon] =latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if(!lat || !lon){
        next(new AppError( 'Please provide latitutr and longitude in the format lat,lng.',
        400));
    }
    const tours = await tourModel.find({
        startLocation : {$geoWithin :{
            $centerSphere:[[lon ,lat] ,radius]
        }}
    })
    res.status(200).json({
        status :"success",
        length :tours.length,
        data :{tours}
    })

})


exports.getDistance=catchAsync(async (req , res , next) =>{
    const {latlng , unit} =req.params;
    const [lat ,lon] =latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    if(!lat || !lon){
        next(new AppError( 'Please provide latitutr and longitude in the format lat,lng.',
        400));
    }
    const distance =await tourModel.aggregate([
        {
            $geoNear :{
                near :{
                    type: "Point",
                    //Do not forget to convert lon lat to numbers 
                    coordinates :[lon *1 , lat *1]
                },
                distanceField :"distance" ,
                distanceMultiplier :multiplier
            }
        },
        {
            $project :{
                name :1,
                distance:1
            }
        }
    ])
    res.status(200).json({
        "status": "success" ,
        "length" :distance.length ,
        "data":{distance}

    })
    

})