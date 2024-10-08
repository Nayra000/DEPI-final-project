const catchAsync = require('./../utils/catchAsync');
const reviewModel = require('./../models/reviewModel');
const bookingModel =require('./../models/bookingModel');
const factory = require('./factoryController');
const AppError =require('./../utils/appError');




exports.setTourUserIds =(req, res, next) =>{
    if(!req.body.tour){
        req.body.tour =req.params.tourId;
    }
    if(!req.body.user){
        req.body.user =req.user.id;
    }
    next();
}

//These middelware to restrict user to make only review to his booked tours
//I put these middelware before create review
exports.checkUserBookedTour =catchAsync(async (req , res ,next)=>{
    const book = await bookingModel.findOne({tour :req.params.tourId , user :req.user._id});
    console.log(req.params.tourId);
    console.log(req.user.id);
    if(!book){
        next(new AppError('You must booked these tour to be able to review the tour' ,400));
    }
    next();
})


exports.getAllReviews=factory.getAll(reviewModel);
exports.createNewReview =factory.createOne(reviewModel);
exports.deleteReview = factory.deleteOne(reviewModel);
exports.updateReview =factory.updateOne(reviewModel);
exports.getSingleReview = factory.getSingleOne(reviewModel);