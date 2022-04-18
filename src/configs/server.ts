import dotenv = require('dotenv');
import express = require('express');
import cors = require('cors');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import path = require('path');
dotenv.config();

import router from '../routes/router';

export class Server{

    public app:express.Application;
    public PORT:number = 3000;

    constructor(){
        this.app = express();
        this.app.set('port', process.env.PORT || this.PORT);

        // milwares
        this.app.use(cors({origin:true, credentials:true}));
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.use(express.static(path.join(__dirname, '../public')));

        // routes
        this.app.use('/api/v2/freshco', router);

    }

    start( callback:any ){
        this.app.listen(this.app.get('port'), callback);
    }

}