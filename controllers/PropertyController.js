var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PropertyModel = mongoose.model("PropertyModel");

module.exports.Save = function(logPropertyList){
    for(let i=0;i<logPropertyList.length;i++){
        let modelIns = new PropertyModel();
        modelIns.name = logPropertyList[i];
        modelIns.save(function(err){
        });
    }
}

module.exports.GetList = function(){
    return new Promise((resolve,reject)=>{
        PropertyModel.find({}, function(err, users) {
            if(err){
                reject(err);
                return;
            }
            resolve(users)  
        });
    });
}