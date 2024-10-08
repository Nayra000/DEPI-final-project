const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user :{
        type :mongoose.Schema.ObjectId,
        ref:'User' ,
        require :[true ,'A booking must be to a user']
    } ,
    tour :{
        type:mongoose.Schema.ObjectId ,
        ref :'Tour' ,
        require :[true ,'A tour must be for a tour']
    },
    price :{
        type :Number ,
        require :[true ,'A price is required']
    },
    createdAt :{
        type :Date ,
        default :Date.now()
    },
    paid :{
        type:Boolean ,
        default:true
    }
})

//prevent duplicate bookings
bookingSchema.index({tour :1 ,user:1} , {unique :true});

bookingSchema.pre(/^find/ , function(next){
    this.populate({
        path:'tour' 
    }).populate({
        path :'user' ,
        select:'name'
    })
    next();
})

const bookingModel = mongoose.model('Booking' ,bookingSchema);
module.exports =bookingModel;