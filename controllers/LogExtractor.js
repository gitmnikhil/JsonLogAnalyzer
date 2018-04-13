const fs = require('fs');
var mongoose = require('mongoose');
const glob = require('glob');
const FileReader = require("./FileReader");
const PropertyController = require("./PropertyController");

module.exports.extractLogs= function(folderPath){
    return new Promise((resolve,reject)=>{
        let logPropertyList = [];
        try{
            try{
                /**
                 * Drop the Table as previous logs are not relevant
                 */
                mongoose.connection.collections["logdatamodels"].drop( function(err) {
                    console.log('collection dropped');
                });
            }catch(err){
                console.log(err);
            }
            try{
                mongoose.connection.collections["propertymodels"].drop( function(err) {
                    console.log('collection dropped');
                });
            }catch(err){
                console.log(err);
            }
            /**
             * Get the file list in the specified folder.
             */
            glob(folderPath + '/**/*',function(err,res){
                /**
                 * Process the file by reading it line by line.
                 * And then save the record in database.
                 * @param {index of the file present in fileList} index 
                 */
                function processNextFile(index){
                    if(index >= res.length){
                        PropertyController.Save(logPropertyList);
                        resolve();
                        return;
                    }
                    let filePath = res[index];
                    if(!fs.lstatSync(filePath).isDirectory()){
                        FileReader.process(filePath, logPropertyList).then(function(){
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
