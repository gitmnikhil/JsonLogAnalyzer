var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PropertySchema = new Schema({name:String});
// Compile model from schema
module.exports.PropertyModel = mongoose.model('PropertyModel', PropertySchema );