const fs = require('fs');
var mongoose = require('mongoose');
const glob = require('glob');
const ReadFile = require("./ReadFile");
const PropertyController = require("./PropertyController");

module.exports.extractLogs= function(folderPath){
    return new Promise((resolve,reject)=>{
        let logPropertyList = [];
        try{
            try{
                mongoose.connection.collections["logdatamodels"].drop( function(err) {
                    console.log('collection dropped');
                });
                mongoose.connection.collections["propertymodels"].drop( function(err) {
                    console.log('collection dropped');
                });
            }catch(err){
                console.log(err);
            }
            glob(folderPath + '/**/*',function(err,res){
                function processNextFile(index,){
                    if(index >= res.length){
                        PropertyController.Save(logPropertyList);
                        resolve();
                        return;
                    }
                    let filePath = res[index];
                    if(!fs.lstatSync(filePath).isDirectory()){
                        ReadFile.ProcessFile(filePath, logPropertyList).then(function(){
                            processNextFile(index + 1)
                        }).catch((exp)=>{
                            processNextFile(index + 1)
                        });
                    }else{
                        processNextFile(index + 1)
                    }
                }
                processNextFile(0);
            })
        }catch(err){
            reject(err);
        }
    });
}
