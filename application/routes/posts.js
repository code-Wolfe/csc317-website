const express = require('express');
const router = express.Router();
const multer = require('multer');

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


router.post("/create", upload.single('videoUpload'),  function(req,res,next){
    console.log(req);
    res.json(req.file);
});


module.exports = router;