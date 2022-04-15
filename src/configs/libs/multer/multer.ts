
import * as multer from 'multer';
import path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, collback){
        collback(null, 'dist/public/uploads')
    },
    filename: (req, file, collback) =>{
        console.log(file);
        
        collback(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage:storage})

export default upload;