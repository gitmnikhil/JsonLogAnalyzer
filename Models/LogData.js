var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogDataSchema = new Schema({log:Schema.Types.Mixed});
// Compile model from schema
module.exports.LogDataModel = mongoose.model('LogDataModel', LogDataSchema );