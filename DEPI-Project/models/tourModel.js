const mongoose = require('mongoose');
const slugify =require('slugify')
const validator = require('validator');
/* const userModel =require('./userModel'); */

const tourSchema = new mongoose.Schema(
    {
        "name" :{
            type:String ,
            required :[true , "The name is required"] ,
            unique :[true ,"The name is unique"],
            trim:true ,
            maxlength:[50 ,'A tour name must have less or equal then 50 characters'],
            minlength :[10 ,'A tour name must have more or equal then 10 characters'],
         /*    validate :[validator.isAlpha ,'Tour name must only contain characters'] */
        },
        "slug" :String ,
        "price" :{
            type :Number ,
            required :[true,"The price is required"]
        } ,
        "priceDiscount" :{
            type:Number,
            validate:{
                validator : function(val){
                    return (val <this.price);
                },
                message :"The discount must be less than the pric"
            }

        },
        "rating" :Number,
        "duration" :{
            type :Number ,
            required :[true ,"The duration is required"],
        },
        "maxGroupSize" :{
            type :Number ,
            required :[true ,"The max group size is required"],
        },
        "difficulty":{
            type :String ,
            required :[true ,"The difficulty is required"],
            trim :true ,
            enum :{
                values:['easy' ,'medium' ,'difficult'],
                message :'Difficulty is either: easy, medium, difficult'
            }
        },
        "ratingsAverage" :{
            type :Number ,
            default:4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0']
        },
        "ratingsQuantity" :{
            type :Number ,
            default:0
        },
        "summary":{
            type :String ,
            trim:true,
            required :[true ,"The summary is required"]
        },
        "description" :{
            type :String ,
            trim:true,
        },
        "imageCover":{
            type :String ,
            required :[true ,"The image cover is required"]
        },
        "images" :[String] ,
        /*  "startDates":[
            {
                date :Date ,
                participants: Number ,
                isSoldout :{
                    type :Boolean ,
                    default :false
                }
            }
        ] */
        "startDates" :[Date],
        "startLocation":{
            //Geospatial
            "type":{
                type:String ,
                default:"Point" ,
                enum :["Point"]
            },
            "coordinates" :[Number],
            "description":String ,
            "address":String
        },
        "locations" :[
            {
                "type":{
                    type:String ,
                    default:"Point" ,
                    enum :["Point"]
                },
                "coordinates" :[Number],
                "description":String ,
            /*     "address":String , */
                "day" :Number
            }
        ],
        "createdAt":{
            type :Date ,
            default:Date.now()
        },
        "secretTour":{
            type:Boolean ,
            default:false
        }
        /* ,"guides" :Array */ ,
        "guides": [{
            type :mongoose.Schema.ObjectId ,
            ref :'User'
        }]
    }
,{
    toJSON:{virtuals :true},
    toObject :{virtuals:true}  
})
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})

//virtual populate
tourSchema.virtual('reviews' ,{
    ref :'Review',
    foreignField:'tour', //as foreign key
    localField:'_id' //as primary key
})

tourSchema.index({price:1 ,ratingsAverage:-1} ) ; //compound index
tourSchema.index({slug :1});
tourSchema.index({startLocation :'2dsphere'})

//You should add your middelware in your schema before creating your model
//these middelware will work only with .save() and .create() it will not work with update
tourSchema.pre('save', function(next) {
    /* console.log(this); */
    this.slug = slugify(this.name, { lower: true });
    next();
});


//embedding 
/* tourSchema.pre('save' ,async function(next){
    console.log(this);
    const guidesPromises = this.guides.map(async id =>await userModel.findById(id));
    this.guides = await Promise.all(guidesPromises);
    next();
}) */

tourSchema.pre(/^find/ ,function(next){
    this.find({secretTour :{$ne :true}});
    this.start =Date.now();
    next();
})
tourSchema.pre(/^find/ ,function(next){
    this.populate({
        path :'guides',
        select :['-__v' ,'-changedPassword']
    }); 
    next();
})

tourSchema.post(/^find/ ,function(res ,next){
    /* console.log(res); */
    console.log(`Query took ${Date.now() - this.start} ms`);
    next();
})

tourSchema.pre('aggregate' ,function(next){
    if(Object.keys(this.pipeline()[0])[0] ==='$geoNear'){
        return next();
    }
    this.pipeline().unshift(
        {
            $match :{secretTour :{$ne :true}}
        }
    )
    next();
})



const tourModel = mongoose.model('Tour' ,tourSchema);




/* tourSchema.pre('save' , function(next){
    console.log(this);
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    next();
}) */

module.exports =tourModel ;


