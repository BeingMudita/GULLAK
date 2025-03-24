const multer = require('multer');
const path = require('path');

//Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    }, 
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

//File filter to accept only images
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }else{
        cb(new Error('Only jpeg and png files are allowed'), false);
    }
};

//Initialise multer instance
const upload = multer({storage, fileFilter});

module.exports = upload;