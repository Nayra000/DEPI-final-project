const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const mongoose = require('mongoose');
const app =require('./index');

//emitter when an error occur in synchronouse code
//note I must put the code in the top to be able see the error
process.on('uncaughtException' ,(err)=>{
    console.log(`${err.name}....${err.message}`);
    server.close(()=>{process.exit(1)});
})


const url =process.env.DATABASE_URL.replace('<PASSWORD>' ,process.env.DATABASE_PASSWORD);

mongoose.connect(url).then(()=>console.log("connect to the database success"))





const server =app.listen(process.env.PORT ||8000 ,()=>{
    console.log(`Server is running on port ${process.env.PORT}` )
})

//emitter when a promise is rejected and not be cought 
process.on('unhandledRejection',(err)=>{
    console.log(`${err.name}....${err.message}`);
    server.close(()=>{process.exit(1)});
    
})




/* console.log(x); */





