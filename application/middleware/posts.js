const db = require("../conf/database");
const {exec} = require('child_process');
const pathToFFMPEG = require('ffmpeg-static');


module.exports = {
    makeThumbnail: async function (req, res, next) {
        if (!req.file) {
            next(new Error("File upload failed"));
        } else {
            try {
                var destinationOfThumbnail = `public/images/uploads/thumbnail-${req.file.filename.split(".")[0]
                    }.png`;
                var thumbnailCommand = `"${pathToFFMPEG}" -ss 00:00:01 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
                var { stdout, stderr } = await exec(thumbnailCommand);
                req.file.thumbnail = destinationOfThumbnail;
                next();
            } catch (error) {
                next(error);
            }
        }
    },  

    getPostsById: async function(req,res,next){
        const postId = req.params.id;
        const sqlStr = 
        "select p.id,p.title,p.description,p.created_at,p.video,u.username, (select count(*) from likes where fk_post_id = ?) from posts p join users u on u.id = p.fk_user_id where p.id = ?;"
        
        try{
            const [rows, _ ] = await db.execute(sqlStr,[postId, postId]);
            const currentPost = rows[0];
            console.log("Post data:", req.post);
            if(!currentPost){
                console.log("error, this post does not exist");
                return req.session.save((err)=>{
                    if(err) next (err);
                    return res.redirect('/');
                })
            }else{
                res.locals.currentPost = currentPost;
                next();
            }
        }catch(err){
            console.log(err);
            next(err);
        }

    },

    getCommentsByPostID: async function(req, res, next) {
        const postId = req.params.id;
        try {
            const [comments, _] = await db.execute(`
                SELECT c.id, c.text, c.fk_post_id, c.fk_user_id, c.created_at, u.username 
                FROM comments c 
                JOIN users u ON u.id = c.fk_user_id
                WHERE c.fk_post_id = ?
            `, [postId]);

            //res.locals.comments = comments;
            res.locals.currentPost.comments = comments;
            
            next();
        } catch(err) {
            console.error("Error fetching comments:", err);
            res.locals.comments = [];  // Set empty array in case of error
            next(err);
        }

    },

    getRecentPosts: async function(req,res,next){
        try{
            const [posts, _] = await db.query(`select p.id, p.title, p.created_at, p.thumbnail from posts p join users u 
                                                on u.id = p.fk_user_id
                                                ORDER BY created_at DESC
                                                `);

            res.locals.posts = posts;
            next();
        }catch(err){
            next(err);
        }
    },

    getPostsByUserId: async function(req,res,next){
        const userId = req.params.id;
    }
}