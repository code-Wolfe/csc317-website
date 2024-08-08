var express = require('express');
var router = express.Router();
const db = require('../conf/database');
const bcrypt = require('bcrypt');
const {checkUsername, checkUsernameUnique, checkEmail, checkEmailUnique, checkPasswords} = require("../middleware/validation");
const { isLoggedIn, isMyProfile } = require('../middleware/auth'); 

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
}); */



// register user
// localhost: 3000/users/register
// put in validation for register 
router.post('/register',checkUsername, checkUsernameUnique, checkEmail, checkEmailUnique, checkPasswords ,async function(req,res,next){

  /*
  console.log(res.body);
  res.end();
  res.json(req.body);
  */
  var {username, password,confirmPassword,email} = req.body;
  console.log(req.body);
  try{

    // check username, password, checkPassword and email validation goes here
    var [rows, fields] = await db.query(`SELECT * FROM users where username =?`,[username])
    if(rows?.length){
      return res.redirect('/register');
    }

    var [rows, fields] = await db.query(`SELECT * FROM users where email =?`,[email])
    if(rows?.length){
      return res.redirect('/register');
    }

    //all data is good
    var hashedPassword = await bcrypt.hash(password, 3)

    var [resultObj, _] = await db.query(`INSERT INTO users (username, email, password) VALUE (?,?,?)`, 
    [ username, email, hashedPassword]);

    console.table(resultObj)

    if(resultObj?.affectedRows == 1){
      res.redirect('/login');
    } else {
      res.redirect('/register');
    }

  }catch(err){
    console.error('Error in registration:', err);
    console.log(err);
    next(err);
  }

 
})

// log in user
router.post('/login', async function(req,res,next){
  //grab data from body
  const {username, password } = req.body;
  //check db for user row based on username
  try{
    const [rows,fields] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    //make sure there is only 1 row
    if(rows.length!== 1){
      req.flash('error', "User not found");
      return res.redirect('/login?error=invalid');
    }

    const user = rows[0];
    //get hashed password and call bcrypt.compare
    const match = await bcrypt.compare(password, user.password); 

    if(match){
      //login successful

      req.session.user = {
        username: user.username,
        userId: user.id,
        email: user.email
      }
      console.log('Setting success flash message');
      req.flash('success', 'You have successfully logged in');
      //console.log('Flash messages after setting:', req.flash());

      req.session.save((err) =>{
        //console.log("login successful");
        //req.flash('success', 'You have successfully logged in');
        //console.log('Flash set for login:', req.flash('success'));
        res.redirect('/');
      });


    } else {
      //console.log("login failed");
      req.flash('error', "Invalid username or password");
      req.session.save((err => {
        res.redirect('/login?error=invalid');
      }))
    }

  }catch (err){
    console.error('Login error:', err);
    next(err);
  }

})

// log out user
router.get('/logout',async function(req,res,next){
  req.session.destroy((err) => {
    if(err){
      return console.log(err);
    }
    res.clearCookie('connect.sid') //clear cookie
    res.redirect('/');
  });
});

//user profile
router.get('/:id(\\d+)', isLoggedIn, isMyProfile, async function(req,res,next){
  //var userId = req.params.id;
  //res.render('profile');

  if(!req.session.user || !req.session.user.userId){
    return res.redirect('/login');
  }




  try{
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [req.session.user.userId]);

    if(!user) { return res.status(404).send('User not found');}

    res.render('profile', {title: 'User Profile', user: user[0]});
  }catch(err){
    next(err);
  }
})

module.exports = router;
