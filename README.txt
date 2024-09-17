README
To execute this project:
1)Install and Setup MongoDB and NodeJS.
2)Download the project folder.
3)Open it in VS Code.
4)Type "npm install" in terminal
5)Type "npm start" in the terminal and type http://localhost:3000 in your browser.The website should be running.

To setup the admin username and password:
1)Add the admin registration page path in the index.js file in routes folder.

router.post('/adminregister', async(req, res)=> {
  let username = req.body.username;
  let userpwd= req.body.password;
  let qry={username:username};
  if(username!=''&& userpwd!=''){
  let useresult= await admin.findOne(qry).then(async(docs)=>{
    if(!docs){
      let saltRounds=10;
      let passSalt= await bcrypt.genSalt(saltRounds,async(err,salt)=>{
        let passHash= await bcrypt.hash(userpwd,salt,async(err,hash)=>{
          let acct = {username: username, pwd: hash};
          let newuser= new admin(acct);
          let saveUser= await newuser.save();
        });
      });
    }
  });
    res.render('index');
  }else{
    res.render('adminregister',{loggedIn:false, error:'Both fields are required'});
  }
});

router.get('/setup',async(req,res)=>{
	res.render('adminregister',{error:''})
});

2)Once you save this, go to localhost:3000/setup
3)Enter the username and password of the admin you want to add.
4)After you are done setting up remove the above code from the index.js file.
This ensures that the admin password is stored in an encrypted manner in your database.

The SESSION_SECRET is present in .env


