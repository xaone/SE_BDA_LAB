var mongoose=require('mongoose');
var schema=mongoose.Schema;

let memschema=new schema({
    username:{type:String},
    enroll:{type:String},
    name:{type:String},
    position:{type:String},
    subjects:{type:String},
    pwd:{type:String}
});

module.exports=mongoose.model('members',memschema);