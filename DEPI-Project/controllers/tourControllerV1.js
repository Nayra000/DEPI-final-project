
const fs = require('fs');
let data =JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/tours-simple.json`,'utf-8'));


exports.checkId =(req , res ,next ,val)=>{
    console.log(val);
    const id = +req.params.id;
    const tour =data.find((tour) => tour.id === id);
    if(!tour){
        return res.status(404).json({
            "status" :"fail",
            "timeRequest" :req.requestTime,
            "message":"Invalid id"
        })
    }

    next();
}


exports.checkBody = (req ,res ,next) =>{
    if(!(req.body.name && req.body.price)){
        return (res.status(400).json({
            "status" :"fail" ,
            "message" :"Name and price must be provided"
            
        }))
    }

    next();
} 

exports.getAllTours =(req ,res)=>{
    res.status(200).json({
        "statuts" :"suceess",
        "timeRequest" :req.requestTime,
        "result" :data.length,
        data
    })
}

exports.getSingleTour =(req ,res)=>{
    
    const id = +req.params.id;
    const tour =data.find((tour) => tour.id === id);
    res.status(200).json({
        "statuts" :"suceess",
        "timeRequest" :req.requestTime,
        "data" :tour
    })
}

exports.createNewTour=(req ,res)=>{ 

    const newTour ={
        id:data.length>0?data[data.length-1].id+1 :0,
        ...req.body
    }
    data =[...data , newTour];
    fs.writeFile(`${__dirname}/../dev-data/tours-simple.json`, JSON.stringify(data),"utf-8",(err)=>{
        if(err){
            return res.status(500).json({
                "statuts" :"error",
                "timeRequest" :req.requestTime,
                "result" :err.message
            })
        }
        res.status(201).json({
            "statuts" :"suceess",
            "timeRequest" :req.requestTime,
            "result" :data.length,
            "data" :newTour
        })

    })
}

exports.updateTour =(req ,res)=>{
    const id = +req.params.id;
    const newUpdates = req.body;
    let tour =data.find((tour) => tour.id === id);
    tour ={...tour , ...newUpdates};
    data = data.map((e)=>e.id === tour.id ?tour :e);
    
    fs.writeFile(`${__dirname}/../dev-data/tours-simple.json` ,JSON.stringify(data),'utf-8' ,(err)=>{
        if(err){
            return res.status(500).json({
                "statuts" :"error",
                "timeRequest" :req.requestTime,
                "result" :err.message
            })
        }
        res.status(200).json({
            "statuts" :"suceess",
            "timeRequest" :req.requestTime,
            "data" :tour
        })

    })
}

exports.deleteTour =(req ,res)=>{
    const id = +req.params.id;
    let tour =data.find((tour) => tour.id === id);
    data.filter((e)=>e.id !== id);
    fs.writeFile(`${__dirname}/../dev-data/tours-simple.json` ,JSON.stringify(data),'utf-8' ,(err)=>{
        if(err){
            return res.status(500).json({
                "statuts" :"error",
                "timeRequest" :req.requestTime,
                "result" :err.message
            })
        }
        res.status(200).json({
            "statuts" :"suceess",
            "timeRequest" :req.requestTime,
            "massage":null
            
        })

    })
}





