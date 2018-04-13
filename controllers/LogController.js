var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LogDataModel = mongoose.model("LogDataModel");
var recordPerPage = require("config").get("RecordPerPage");
module.exports.Save = function(data, logPropertyList){
    return new Promise((resolve,reject)=>{
        try{
            let obj = JSON.parse(data);
            let modelIns = new LogDataModel();
            modelIns.log = obj;
            savePropertyToArray(obj, logPropertyList);
            modelIns.save(function(err){
                resolve();
            });
        }catch(err){
            reject();
        }
    })
}

module.exports.query = function(propertiesList,pageNo){
    var perPage = recordPerPage
    var page = pageNo || 1
    var findObj = {};
    var propKeys = Object.keys(propertiesList);
    for(var i=0;i<propKeys.length;i++){
        if(propertiesList[propKeys[i]].IsRegex){
            findObj["log." + propKeys[i]] = {$regex : propertiesList[propKeys[i]].value};
        }else{
            findObj["log." + propKeys[i]] = propertiesList[propKeys[i]].value;
        }

    }
    console.log(findObj);
    return new Promise((resolve,reject)=>{
        LogDataModel.find(findObj).skip((perPage * page) - perPage).limit(perPage).exec(function(err, list) {
            if(err){
                reject(err);
                return;
            }
            resolve({
                logs:list,
                current:page
            })  
        })
    });
}

function savePropertyToArray(obj, logPropertyList){
    let objKeys = Object.keys(obj);
    for(var i=0;i<objKeys.length;i++){
        if(logPropertyList.indexOf(objKeys[i])< 0){
            logPropertyList.push(objKeys[i]);
        }
    }
}