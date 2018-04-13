var fs = require('fs')
    , es = require('event-stream');
    const LogController = require('./LogController');

var lineNr = 0;

module.exports.process = function(filePath, logPropertyList){
    return new Promise((resolve,reject)=>{
        try{
            var s = fs.createReadStream(filePath).pipe(es.split()).pipe(es.mapSync(function(line){
                s.pause();
                lineNr += 1;
                LogController.Save(line, logPropertyList).then(function(){
                    s.resume();
                }).catch((err)=>{
                    s.resume();
                });            
            })
            .on('error', function(err){
                reject();
            })
            .on('end', function(){
                console.log("File parsing completed");
                resolve();
            }));
        }
        catch(err){
            console.log(err);
        }
    })
}
