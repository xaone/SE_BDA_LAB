var express = require('express');
var router = express.Router();
var admin= require('../models/admins');
var publs =require('../models/publications');
var project = require('../models/projects');
var bcrypt = require('bcrypt');
var bodyParser= require('body-parser');

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
      let userResult= await admin.findOne(qry).then(async(docs)=>{
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
        publs.find({}).then((docs)=>{
            project.find({}).then((data)=>{
                res.render("adminprofile",{loggedIn:sesh.loggedIn,list:docs,list2:data});
            })
        });
    }
    else{
      res.render('adminlogin',{loggedIn:false,error:'Invalid Login'});
    }
});

router.post('/addpubl',(req,res)=>{
    let sesh=req.session;
    if(sesh.loggedIn){
        res.render('addpublication');
    }
    else{
        res.render('adminlogin',{loggedIn:false,error:''});
    }
});

router.post('/addpublnow',async(req,res)=>{
    let sesh=req.session;
    if(sesh.loggedIn){
    let publ ={
		autid1: req.body.autid1,
		autid2: req.body.autid2,
		autid3: req.body.autid3,
		author1:req.body.author1,
		author2:req.body.author2,
		author3:req.body.author3,
		mla: req.body.mla,
		title: req.body.title,
		pdf: req.body.pdf
	};
	let newpubl= new publs(publ);
    let savepubl= await newpubl.save();
    publs.find({}).then((docs)=>{
        project.find({}).then((data)=>{
            res.render("adminprofile",{loggedIn:sesh.loggedIn,list:docs,list2:data});
        })
    });
    }
    else{
        res.render('adminlogin',{loggedIn:false,error:''});
    }
});

router.post('/addproj',(req,res)=>{
    let sesh=req.session;
    if(sesh.loggedIn){
        res.render('addproject');
    }
    else{
        res.render('adminlogin',{loggedIn:false,error:''});
    }
});

router.post('/addprojnow',async(req,res)=>{
    let sesh=req.session;
    if(sesh.loggedIn){
    let proj ={
        granter: req.body.granter,
		amount: req.body.amount,
		duration: req.body.duration,
		status:req.body.status,
		title: req.body.title
	};
	let newproj= new project(proj);
    let saveproj= await newproj.save();
    publs.find({}).then((docs)=>{
        project.find({}).then((data)=>{
            res.render("adminprofile",{loggedIn:sesh.loggedIn,list:docs,list2:data});
        })
    });
    }
    else{
        res.render('adminlogin',{loggedIn:false,error:''});
    }
});

router.get('/projdelete/:id', async(req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.redirect('/login');
    } else {
        let projId = req.params.id;
        let qry = {_id:projId};
        let deleteResult = await project.deleteOne(qry);
        publs.find({}).then((docs)=>{
            project.find({}).then((data)=>{
                res.render("adminprofile",{loggedIn:sesh.loggedIn,list:docs,list2:data});
            })
        });
    }
});

router.get('/publdelete/:id', async(req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.redirect('/login');
    } else {
        let publId = req.params.id;
        let qry = {_id:publId};
        let deleteResult = await publs.deleteOne(qry);
        publs.find({}).then((docs)=>{
            project.find({}).then((data)=>{
                res.render("adminprofile",{loggedIn:sesh.loggedIn,list:docs,list2:data});
            })
        });
    }
});

router.get('/publedit/:id', async(req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.render('adminlogin', {loggedIn:false, error:'Invalid Request'});
    } else {
        let id = req.params.id;
        let err = '';
        let qry = {_id:id};

        let itemResult = await publs.find(qry).then( (itemData) => {
            if (itemData == null) {
                err = 'Invalid ID';
            }
            res.render('editpublication', {article:itemData, loggedIn:sesh.loggedIn, error:err});
        });
    }
});

router.post('/savepubl', async(req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.redirect('/login');
    } else {
        
        let autid1= req.body.autid1;
        let autid2= req.body.autid2;
        let autid3= req.body.autid3;
        let author1=req.body.author1;
        let author2=req.body.author2;
        let author3=req.body.author3;
        let mla= req.body.mla;
        let title=req.body.title;
        let pdf= req.body.pdf;
        let pid=req.body.pid;
        let qry = {_id:pid};

        let saveData = {
            $set: {
                autid1:autid1,
                autid2:autid2,
                autid3:autid3,
                author1:author1,
                author2:author2,
                author3:author3,
                mla:mla,
                title:title,
                pdf:pdf
            }
        }

        let updateResult = await publs.updateOne(qry, saveData);
        publs.find({}).then((docs)=>{
         project.find({}).then((data)=>{
            res.render("adminprofile",{loggedIn:sesh.loggedIn,list:docs,list2:data});
        })
    });
        
    }
});

router.get('/projedit/:id', async(req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.render('adminlogin', {loggedIn:false, error:'Invalid Request'});
    } else {
        let id = req.params.id;
        let err = '';
        let qry = {_id:id};

        let itemResult = await project.find(qry).then( (itemData) => {
            if(itemData == null){
                err = 'Invalid ID';
            }
            res.render('editproject', {article:itemData, loggedIn:sesh.loggedIn, error:err});
        });
    }
});

router.post('/saveproj', async(req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.redirect('/login');
    } else {
        
        let title= req.body.title;
        let granter= req.body.granter;
        let duration= req.body.duration;
        let amount=req.body.amount;
        let status=req.body.status;
        let pid=req.body.pid;
        let qry = {_id:pid};
        let saveData = {
            $set: {
                title:title,
                status:status,
                granter:granter,
                duration:duration,
                amount:amount
            }
        }
        
        let updateResult = await project.updateOne(qry, saveData);
        publs.find({}).then((docs)=>{
         project.find({}).then((data)=>{
            res.render("adminprofile",{loggedIn:sesh.loggedIn,list:docs,list2:data});
        })
    });
        
    }
});

module.exports = router;