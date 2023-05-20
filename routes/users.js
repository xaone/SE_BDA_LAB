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
    res.render('memlogin',{loggedIn:false,error:'Invalid Login'});
  }
});

router.get('/edit/:id', async(req, res) => {
  let sesh = req.session;

  if (!sesh.loggedIn) {
      res.render('memlogin', {loggedIn:false, error:'Invalid Request'});
  } else {
      let id = req.params.id;
      let err = '';
      let qry = {_id:id};

      let itemResult = await members.find(qry).then( (itemData) => {
          if(itemData == null){
              err = 'Invalid ID';
          }
          res.render('editmember', {article:itemData, loggedIn:sesh.loggedIn, error:err});
      });
  }
});

router.post('/saveprofile', async(req, res) => {
  let sesh = req.session;

  if (!sesh.loggedIn) {
      res.redirect('/login');
  } else {
      
      let name= req.body.name;
      let position= req.body.position;
      let subjects=req.body.subjects;
      let pid=req.body.pid;
      let qry = {_id:pid};
      let saveData = {
          $set: {
              name:name,
              position:position,
              subjects:subjects
          }
      }
      
      let updateResult = await members.updateOne(qry, saveData);
      members.findOne(qry).then((docs)=>{
        publs.find(		
          {
            "$or":[
              {autid1:{$regex:docs.username}},
              {autid2:{$regex:docs.username}},
              {autid3:{$regex:docs.username}}
            ]
          }).then((data)=>{
            res.render("memprofile",{m:docs,list:data,loggedIn:sesh.loggedIn});
        });	
      });
      
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
  const reg= new RegExp("mit[0-9]{7}");
  if(username!=''&& userpwd!=''&& username.match(reg)){
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
    res.render('memregister',{loggedIn:false, error:'Invalid Registration'});
  }
});


module.exports = router;
