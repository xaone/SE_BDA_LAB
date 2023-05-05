const mongoose = require('mongoose')
const Schema = mongoose.Schema
var publschema= new Schema({
	autid1:{type:String},
    autid2:{type:String},
    autid3:{type:String},
	mla:{type:String},
	author1:{type:String},
    author2:{type:String},
    author3:{type:String},
	title:{type:String},
	pdf:{type:String}
})

module.exports=mongoose.model('publics',publschema);