// import multer = require("multer");
// import path = require("path");

// const storage = multer.diskStorage({
//     destination: (req, file, collback) =>{
//         collback(null, './uploads')
//     },
//     filename:(req, file, callback) => {
//         const ext = file.originalname.split('.').pop;
//         callback(null, `${Date.now()}.${ext}`);
//     }
// });

// const upload = multer({storage:storage})

// export default upload;

import * as multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './uploads')   
    },
    filename:(req, file, callback) => {
        const date =  Date.now();
        const ext = file.originalname.split('.').pop();
        callback(null, `${date}.${ext}`);
    }
});

const upload = multer({storage:storage})

export default upload;