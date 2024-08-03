const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require("../conf/database");
const { isLoggedIn } = require('../middleware/auth');
const {getPostsById, makeThumbnail} = require('../middleware/posts');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/videos/uploads')
    },
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split("/")[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`)
    }
});

const upload = multer({storage: storage});

//post/create
router.post("/create", isLoggedIn, upload.single('videoUpload'), makeThumbnail, async function(req,res,next){

    console.log("Session user:", req.session.user);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const userId = req.session.user.userId;
    const {title, description} = req.body;
    const {path, thumbnail} = req.file;

    try{
        const [resultObj, _] = await db.query(`INSERT INTO posts (title, description, video,thumbnail,fk_user_id) VALUES (?,?,?,?,?)`,
            [title,description,path,thumbnail,userId]);

            if(resultObj.affectedRows === 1){
                console.log("Success, your post has been created");
                return req.session.save((err)=>{
                    if(err) next(err);
                    res.redirect(`/posts/${resultObj.insertId}`)
                })  
            }else{
                console.log("error your post cant be created");
                return req.session.save((err)=>{
                    if(err) next(err);
                    console.out("HERE");
                    return res.redirect('/postvideo');
                })
            }
    }catch(err){
        next(err)
    }
});
/** posts/# */
router.get('/:id(\\d+)', getPostsById, function(req, res, next) {
    console.log("Rendering viewpost with data:", req.post);
    res.render('viewpost', { title: 'Post' });
  });


/* GET view post page. 
router.get('/viewpost/:id(\\d+)', function(req, res, next) {
    res.render('viewpost', { title: 'View Post', js: 'viewpost.js' });
  });*/



module.exports = router;