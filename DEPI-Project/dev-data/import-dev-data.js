const dotenv = require('dotenv');
dotenv.config({path:'./../config.env'});


const mongoose = require('mongoose');
const fs = require('fs');

const tourModel =require('./../models/tourModel');
const userModel =require('./../models/userModel');
const reviewModel =require('./../models/reviewModel');

const toursData =JSON.parse(fs.readFileSync('./tours.json' ,'utf-8'));
const reviewsData =JSON.parse(fs.readFileSync('./reviews.json' ,'utf-8'));
const usersData =JSON.parse(fs.readFileSync('./users.json' ,'utf-8'));


const url =process.env.DATABASE_URL.replace('<password>' ,process.env.PASSWORD);

mongoose.connect(url).then(()=>console.log("connect to the database success"));

const deleteDB = async ()=>{
    try{
        await tourModel.deleteMany();
      /*   await userModel.deleteMany();
        await reviewModel.deleteMany(); */
        console.log('Deleting Done');
    }
    catch(e){
        console.log(e.message);
    }
}


const populateDB =  async ()=>{
    try{
        await tourModel.create(toursData );
       /*  await userModel.create(usersData ,{validateBeforeRun :false});
        await reviewModel.create(reviewsData,{validateBeforeRun :false}); */
        console.log('Created Success');
    }
    catch(e){
        console.log(e.message);
    }
};

const connectAndPopulate = async () => {
    try {
      await deleteDB();
      await populateDB();
  
    /*   mongoose.disconnect(); */
    } catch (e) {
      console.log(e.message);
    }
  };
  
  connectAndPopulate();