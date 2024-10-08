const catchAsync =require('./../utils/catchAsync');
const AppError =require('./../utils/appError');
const ApiFeatures =require('./../utils/apiFeatures');
exports.deleteOne =(Model)=>{
    return catchAsync(async (req ,res ,next)=>{
        const doc =await Model.findByIdAndDelete(req.params.id);
        if(!doc) {
            return next(new AppError('No document found' ,404));
        }
        res.status(204).json({
            "status" :"success",
            "data" :null
        })
    })
}

exports.updateOne =(Model) =>{
    return catchAsync(async (req ,res ,next)=>{
        const doc = await Model.findByIdAndUpdate(req.params.id ,req.body ,{
            new :true ,
            runValidators:true
        })
        if(!doc) {
            return next(new AppError('No document found' ,404));
        }
        
        res.status(200).json({
            "status" :"success",
            data :doc
        })
    })
}


exports.createOne =(Model) =>{
    return catchAsync(async(req ,res ,next)=>{ 
        const doc = await Model.create({...req.body});
        res.status(201).json({
            "status" :"success",
            "data" :{doc}
        })
    })
}

exports.getSingleOne = (Model , popObj)=>{
    return catchAsync(async (req ,res ,next)=>{
        let query = Model.findById(req.params.id)
        if(popObj){
            query =query.populate(popObj);
        }
        const doc = await query ;
        if(!doc) {
            return next(new AppError('No document found' ,404));
        }
        res.status(200).json({
            "statuts" :"suceess",
            "timeRequest" :req.requestTime,
            "data" : doc
        })
    })
}

exports.getAll = (Model) =>{
    return catchAsync(async (req ,res ,next)=>{
        let filterObj ={};
        //To get the reviews for certain tour
        //To get the bookings for certain tour
        if(req.params.tourId){
            filterObj ={tour : req.params.tourId};
        }

        if(req.params.userId){
            filterObj ={user : req.params.userId};
        }


        const counts =await Model.countDocuments(); 
        const query =new ApiFeatures(Model.find(filterObj) , req.query)
        .filter()
        .sort()
        .limit()
        .paginate(counts) ;
        const docs = await query.query;
        res.status(200).json({
            "statuts" :"suceess",
            "length":docs.length,
            "timeRequest" :req.requestTime,
            "data" :{docs}
        })
    }
    )
} 









