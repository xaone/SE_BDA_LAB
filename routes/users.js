var express = require('express');
var router = express.Router();
var members= require('../models/members');
var publs =require('../models/publications');
var bcrypt = require('bcrypt');
var bodyParser= require('body-parser');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',async(req,res)=>{
  let username=req.body.username;
  let userpwd = req.body.password;
  let sesh= req.session;
  sesh.loggedIn=false;
  sesh.user={
    userid:username
  };
  let qry={username:username};
  if(username!=''&&userpwd!=''){
    let userResult= await members.findOne(qry).then(async(docs)=>{
      if(docs){
        let passResult =await bcrypt.compare(userpwd,docs.pwd).then((isMatch)=>{
          if(isMatch){
          sesh.loggedIn=true;
          }
        });
      }
    });
  }
  if(sesh.loggedIn){
    
    members.findOne(qry).then((docs)=>{
      publs.find(		
        {
          "$or":[
            {autid1:{$regex:username}},
            {autid2:{$regex:username}},
            {autid3:{$regex:username}}
          ]
        }).then((data)=>{
          res.render("memprofile",{m:docs,list:data});
      });	
    });
    
  }
  else{
    res.render('login',{loggedIn:false,error:'Invalid Login'});
  }
});

router.post('/register', async(req, res)=> {
  let username = req.body.username;
  let userpwd= req.body.password;
  let name=req.body.name;
	let	enroll= req.body.username;
	let	position= req.body.position;
	let	subjects= req.body.subjects;
  let qry={username:username};
  if(username!=''&& userpwd!=''){
  let useresult= await members.findOne(qry).then(async(docs)=>{
    if(!docs){
      let saltRounds=10;
      let passSalt= await bcrypt.genSalt(saltRounds,async(err,salt)=>{
        let passHash= await bcrypt.hash(userpwd,salt,async(err,hash)=>{
          let acct = {username: username, pwd: hash,name:name,enroll:enroll,position:position,subjects:subjects, level:'admin'};
          let newuser= new members(acct);
          let saveUser= await newuser.save();
        });
      });
    }
  });
    res.render('memlogin',{loggedIn:false, error:'Please login with your new account'});
  }else{
    res.render('memregister',{loggedIn:false, error:'Both fields are required'});
  }
});


module.exports = router;
