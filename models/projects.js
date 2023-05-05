const mongoose = require('mongoose')
const Schema = mongoose.Schema
var projschema= new Schema({
	title:{type:String},
    granter:{type:String},
    duration:{type:String},
	amount:{type:String},
	status:{type:String}
});

module.exports=mongoose.model('projects',projschema);