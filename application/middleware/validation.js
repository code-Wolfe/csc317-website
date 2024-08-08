 
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
        next();
    },
    checkPasswords: async function(req,res,next){
        next();
    },
    checkUsernameUnique: async function(req, res, next){
        next();
    },
    checkEmailUnique: async function(req,res,next){
        next();
    }
 }