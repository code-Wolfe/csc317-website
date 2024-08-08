 
const db = require('../conf/database');

 function countLetters(str) {
    let count = 0; 
    for (let char of str) {
        if ((char >= 'a' && char <= 'z') || 
            (char >= 'A' && char <= 'Z') || 
            (char >= '0' && char <= '9')) {
            count++;
        }
    }
    return count;
}

function startWithLetter(str) {
    if (str.length === 0) return false;
    const firstChar = str[0].toLowerCase();
    return firstChar >= 'a' && firstChar <= 'z';
}

 module.exports = {
    checkUsername: async function(req,res,next){
        const { username } = req.body;
        if(username){
            if(countLetters(username) < 3){
                req.flash('error',"Username needs to have at least 3 letters")
                return res.redirect('/register');
            }
        }

        next();
    },
    checkEmail: async function(req,res,next){
        const email = req.body.email;

        if (email.trim() === '') {
            req.flash('error', 'email is required');
        } else {
            next();
        }

        
    },
    checkPasswords: async function(req,res,next){
        const { password, confirmPassword} = req.body;
        if(password){
            if (password.length < 8) {
                req.flash('error', "Password must be at least 8 characters long");
                return res.redirect('/register');
            }

            let hasNumber = false;
            let hasUpperCase = false;
            let hasSpecialChar = false;
            const specialChars = "/*-+!@#$^&~[]";

            for (let char of password) {
                if (char >= '0' && char <= '9') {
                    hasNumber = true;
                } else if (char === char.toUpperCase() && char !== char.toLowerCase()) {
                    hasUpperCase = true;
                } else if (specialChars.includes(char)) {
                    hasSpecialChar = true;
                }
            }

            if (!hasNumber) {
                req.flash('error', "Password must contain at least one number");
                return res.redirect('/register');
            }
            if (!hasUpperCase) {
                req.flash('error', "Password must contain one uppercase letter");
                return res.redirect('/register');
            }
            if (!hasSpecialChar) {
                req.flash('error', "Password must contain one of the following: /*-+!@#$^&~[]");
                return res.redirect('/register');
            }
            if (password !== confirmPassword) {
                req.flash('error', "Passwords must match");
                return res.redirect('/register');
            }
        } else{
            req.flash('error', "Password is required");
            next();
        }


        next();
    },
    checkUsernameUnique: async function(req, res, next){
        const username = req.body.username;
        var [rows, fields] = await db.query(`SELECT * FROM users where username =?`,[username]);
        if(rows?.length){
            res.flash('error', "Username already exists");
          return res.redirect('/register');
        }else{
             next();
        }
       
    },
    checkEmailUnique: async function(req,res,next){
        const email = req.body.email;

        var [rows, fields] = await db.query(`SELECT * FROM users where email =?`,[email])
        if(rows?.length){
            res.flash('error', "Email already exists");
            return res.redirect('/register');
        }else{
           next(); 
        }
        
    }
 }