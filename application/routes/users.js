var express = require('express');
var router = express.Router();
const db = require('../conf/database')
const bcrypt = require('bcrypt');

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
}); */


// register user
// localhost: 3000/users/register
router.post('/register', async function(req,res,next){

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
    if(rows?.lenth){
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
      console.log("User not found");
      return res.redirect('/login?error=invalid');
    }

    const user = rows[0];
    //get hashed password and call bcrypt.compare
    const match = await bcrypt.compare(password, user.password);

    if(match){
      //login successful
      // TODO: session management

      console.log("login successful");
      res.redirect('/');
    } else {
      console.log("login failed");
      res.redirect('/login?error=invalid');
    }

  }catch (err){
    console.error('Login error:', err);
    next(err);
  }

})

// log out user - wait until sessions
router.post('/logout',function(req,res,next){

})

router.get('/:id(\\d+)', function(req,res,next){

})

module.exports = router;
