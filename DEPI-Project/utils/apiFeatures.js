/* const tourModel =require('./../models/tourModel'); */

class ApiFeatures{
    constructor(query ,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    filter(){
        let filterObject = {...this.queryStr};
        ['limit' ,'page' ,'sort','fields'].forEach((e) => delete filterObject[e]);
        let filterStr = JSON.stringify(filterObject);
        //in regex do not write space 
        filterStr =filterStr.replace(/\b(gt|gte|lt|lte)\b/g ,(match)=>`$${match}`);
        this.query=  this.query.find(JSON.parse(filterStr));

        return this;
    }

    sort(){
        if(this.queryStr.sort){
            console.log(this.queryStr.sort);
            const sortBy =this.queryStr.sort.split(',').join(" ");
            this.query=this.query.sort(sortBy);
        }
        else{
            this.query=this.query.sort("maxGroupSize");
        }
        return  this;
    }

    limit(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(',').join(' ');
            console.log(fields);
            this.query = this.query.select(fields);
        }
        else{
            this.query = this.query.select('-__v');
        }

        return this;

    }

    paginate(counts){
        const page =this.queryStr.page *1 || 1;
        const limit =this.queryStr.limit *1 || 100;
        const skip =(page -1) * limit;
        if(skip >= counts){
            throw new Error("The page dose not exist") ;
        }
        this.query = this.query.skip(skip).limit(limit);
        return this;
    
    }
}

module.exports =ApiFeatures;