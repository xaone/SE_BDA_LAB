var mongoose=require('mongoose');
var schema=mongoose.Schema;

let adminschema=new schema({
    username:{type:String},
    pwd:{type:String}
});

module.exports=mongoose.model('admins',adminschema);