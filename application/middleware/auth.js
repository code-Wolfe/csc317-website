module.exports = {
    isLoggedIn: function(req,res,next){
        if(req.session.user){
            next();
        } else{
            console.log("Must be logged in to access");
            req.session.save((err) =>{
                res.redirect("/");
            })
        }
    },

    isMyProfile: function(req,res,next){
        const userId = req.params.id;
        if(req.session.user.userId == userId){
            next()
        }else{
            console.log("Not your profile");
            req.session.save((err) =>{
                res.redirect("/");
            })
        }
    }
}