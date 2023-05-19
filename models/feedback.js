const mongoose = require('mongoose')
const Schema = mongoose.Schema
var feedschema= new Schema({
	review:{type:String},
    email:{type:String}
});

module.exports=mongoose.model('feedback',feedschema);