var express = require('express');
var router = express.Router();
var members=require('../models/members');
var publs=require('../models/publications');
var project=require('../models/projects');
var admin=require('../models/admins');
var feedback = require('../models/feedback');
var bcrypt = require('bcrypt');
var bodyParser= require('body-parser');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{loggedIn:false});
});

router.get('/researchers',(req,res)=>{
  res.render('researchers')
});


router.get('/deepl',(req,res)=>{
  res.render('deepl')
});

router.get('/imageandvivid',(req,res)=>{
  res.render('imageandvivid')
});

router.get('/visualRecog',(req,res)=>{
  res.render('visualRecog')
});

router.get('/memlogin',(req,res)=>{
  res.render('memlogin',{error:"",loggedIn:false})
});

router.get('/adminlogin',(req,res)=>{
  res.render('adminlogin',{error:"",loggedIn:false})
});

router.get('/memregister',(req,res)=>{
  res.render('memregister',{error:""})
});


router.get('/loginchoice',(req,res)=>{
  res.render('loginchoice',{error:"",loggedIn:false})
});

router.get('/viewmem',(req,res)=>{
  members.find({}).then((docs)=>{
    res.render("viewmembers",{list:docs});
  });
});

router.get('/viewpubl',(req,res)=>{
  publs.find({}).then((docs)=>{
    res.render("viewpublications",{list:docs});
  });
});

router.get('/viewproj',(req,res)=>{
  project.find({}).then((docs)=>{
    res.render("viewproject",{list:docs});
  });
});

router.get('/feedback',(req,res)=>{
  res.render("feedbackpage");
});

router.post('/subfeedback',async(req,res)=>{
  let feed ={
    review: req.body.review,
    email: req.body.email
  };
  let newfeed= new feedback(feed);
  let savefeed= await newfeed.save();
  res.redirect('/');
});


router.get('/profile/:id',async(req,res)=>{
  let memid=req.params.id;
  let qry={_id:memid};
    members.findOne(qry).then((docs)=>{
      publs.find(		
        {
          "$or":[
            {autid1:{$regex:docs.username}},
            {autid2:{$regex:docs.username}},
            {autid3:{$regex:docs.username}}
          ]
        }).then((data)=>{
          res.render("viewprofile",{m:docs,list:data});
      });	
    });
});

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
