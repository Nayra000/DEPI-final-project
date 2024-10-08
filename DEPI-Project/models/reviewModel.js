const mongoose = require('mongoose');
const tourModel = require('./tourModel');
const AppError =require('./../utils/appError');

const reviewSchema = new mongoose.Schema({
    "review" :{
        type :String ,
        required: [true ,'Review can not be empty'] ,
    },
    "rating" :{
        type:Number , 
        required:true,
        min:1,
        max:5
    },
    "createdAt" :{
        type:Date,
        default :Date.now()
    },
    "user" :{
        type:mongoose.Schema.ObjectId,
        ref:'User' ,
        required :[true, 'The review must belong to a user']
    },
    "tour" :{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required :[true, 'The review must belong to a tour']
    }
},{
    toJSON:{virtuals :true} ,
    toObject:{virtuals :true}
});

reviewSchema.pre(/^find/  , function(next){
    this/* .populate({
        path:"tour" ,
        select :"name"
        
    }) */.populate({
        path:"user",
        select :"name photo"
    });
    next();

})


reviewSchema.statics.calcAverageRatings =async function(tourId){
    //note I used post middelware below to make match work after saving data if I used pre match will select data and do not see the new data 
    const state=await this.aggregate([
        {
            $match :{tour :tourId}
        } ,
        {
            $group :{
                _id :"$tour" ,
                nRatings :{$sum :1} ,
                avgRatings :{$avg :"$rating"} ,
                $set :()=>{Math.round(avgRatings *10)/10}
            }
        }
    ])
    if(state.length >0){
        await tourModel.findByIdAndUpdate({_id:tourId } ,{
            ratingsAverage :state[0].avgRatings,
            ratingsQuantity:state[0].nRatings
        });   
    }else{
        await tourModel.findByIdAndUpdate({_id:tourId } ,{
            ratingsAverage :4.5,
            ratingsQuantity:0
        }); 
    }
}

reviewSchema.index({tour :1 ,user:1} ,{unique :true} );
reviewSchema.post('save' ,async function(){
    this.constructor.calcAverageRatings(this.tour);
})

reviewSchema.pre(/^findOneAnd/ ,async function(next){
    //.clone() Make a copy of this query so you can re-execute it.
    //The problem with jonas code is trying to excute the query twice (when I used await)
    this.rDocs =  await this.clone().findOne();
    next();
})

reviewSchema.post(/^findOneAnd/ ,async function(){

  await this.rDocs.constructor.calcAverageRatings(this.rDocs.tour);
})


const reviewModel =mongoose.model('Review' ,reviewSchema ) ;

module.exports = reviewModel;