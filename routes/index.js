var express = require('express');
var router = express.Router();
var members=require('../models/members');
var publs=require('../models/publications');
var project=require('../models/projects');
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

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
