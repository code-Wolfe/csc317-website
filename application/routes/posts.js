const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require("../conf/database");
const { isLoggedIn } = require('../middleware/auth');
const {getPostsById, makeThumbnail, getCommentsByPostID} = require('../middleware/posts');

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
                //console.log("Success, your post has been created");
                req.flash('success', 'your post has been created');
                return req.session.save((err)=>{
                    if(err) next(err);
                    res.redirect(`/posts/${resultObj.insertId}`)
                })  
            }else{
                //console.log("error your post cant be created");
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
router.get('/:id(\\d+)', getPostsById, getCommentsByPostID, function(req, res, next) {

    res.render('viewpost', { 
        title: 'Post',
        currentPost: res.locals.currentPost,
        comments: res.locals.currentPost.comments || []
    });

});


/* GET view post page. 
router.get('/viewpost/:id(\\d+)', function(req, res, next) {
    res.render('viewpost', { title: 'View Post', js: 'viewpost.js' });
  });*/


//localhost:3000/post/search?searchterm=term
router.get("/search", async function(req,res,next){


    try{
        const searchTerm = req.query.searchTerm;
        const [rows,_] = await db.query(`select id,p.title, p.description,p.thumbnail, CONCAT_WS(' ', p.title, p.description) as haystack 
                                        from posts p
                                        having haystack
                                        like ?;`,[`%${searchTerm}%`]);

    if(rows.length){
        res.locals.posts = rows;
        res.render('index', { title: 'CSC 317 App',js: ['index.js'],searchTerm });
    }else{
        req.flash('error', `No results found for "${searchTerm}". Please try a different search term.`);
        res.redirect('/');
        
    }

    }catch(err){
        next(err);
    }
});

router.post("/like/:id(\\d+)", async function(req,res,next){
    
    try{
        if(!req.session.user){
            return res.json({
                status: "error",
                message: "you must be logged in to like a post"
            }).status(401);
        }

        const postId = req.params.id;
        const userId = req.session.user.userId;

        var [rows,_] = await db.query('select * from likes where fk_post_id = ? AND fk_user_id = ?', [postId, userId]);

        if(rows.length == 0){
            //save new like
            var [insertRes, _] = await db.query(`insert into likes (fk_post_id, fk_user_id) VALUE (?,?)`,[postId, userId]);
            if(insertRes.affectedRows == 1){
                return res.json({
                    status: "success",
                    message: "like saved",
                    isLiked: true,
                    likeCount:1
                }).status(201);
            } else{
                return res.json({
                     status: "error",
                     message: "failed to save like"
                })
            }

        } else if(rows.length == 1){
            var [insertRes, __] = await db.query(`delete from likes where fk_post_id = ? AND fk_user_id = ?`,[postId, userId]);
            if(insertRes.affectedRows == 1){
                return res.json({
                    status: "success",
                    message: "like removed",
                    isLiked: false,
                    likeCount:0
                }).status(201);
            } else{
                return res.json({
                     status: "error",
                     message: "failed to save like"
                })
            }
        } else {
            //something weird happened
            next("something odd");
        }
        res.json(postId);
    }catch(err){
        next(err);
    }
    

})

router.delete("/:id(\\d+)", async function(req,res,next){
    
})




module.exports = router;