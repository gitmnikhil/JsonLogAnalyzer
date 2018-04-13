var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LogDataModel = mongoose.model("LogDataModel");

module.exports.Save = function(data, logPropertyList){
    return new Promise((resolve,reject)=>{
        try{
            let obj = JSON.parse(data);
            let modelIns = new LogDataModel();
            modelIns.log = obj;
            saveProperty(obj, logPropertyList);
            modelIns.save(function(err){
                resolve();
            });
        }catch(err){
            reject();
        }
    })
}

module.exports.query = function(propertiesList){
    var findObj = {};
    var propKeys = Object.keys(propertiesList);
    for(var i=0;i<propKeys.length;i++){
        findObj["log." + propKeys[i]] = propertiesList[propKeys[i]];
    }
    return new Promise((resolve,reject)=>{
        LogDataModel.find(findObj, function(err, list) {
            if(err){
                reject(err);
                return;
            }
            resolve(list)  
        });
    });
}

function saveProperty(obj, logPropertyList){
    let objKeys = Object.keys(obj);
    for(var i=0;i<objKeys.length;i++){
        if(logPropertyList.indexOf(objKeys[i])< 0){
            logPropertyList.push(objKeys[i]);
        }
    }
}