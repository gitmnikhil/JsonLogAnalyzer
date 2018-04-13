var express = require('express');
var router = express.Router();
const LogExtractor= require("../controllers/LogExtractor");
const PropertyController= require("../controllers/PropertyController");
const LogController= require("../controllers/LogController");
var events = require('events');
var eventEmitter = require("../pubshub").pubsub;

router.post('/processlogs', function(req, res, next) {
  if(req.body.path){
    LogExtractor.extractLogs(req.body.path).then(()=>{
      eventEmitter.emit('socketMsg'); 
    }).catch((err)=>{
      eventEmitter.emit('socketMsg'); 
    });
    res.send({"success":true});
  }else{
    res.send({"success":false});
  }
});

router.post('/logs', function(req, res, next) {
  if(req.body.propertiesList){
    LogController.query(req.body.propertiesList,req.body.page).then((list)=>{
      res.send(list);
    }).catch((err)=>{
      console.log(err);
      res.send([]);
    });
  }else{
    res.send([]);
  }
});

router.get('/properties', function(req, res, next) {
  PropertyController.GetList().then((list)=>{
    res.send(list);
  }).catch((err)=>{
    res.send([]);
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
