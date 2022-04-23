import dotenv = require('dotenv');
import express = require('express');
import cors = require('cors');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import path = require('path');
dotenv.config();
import { Server as socketIO } from "socket.io";
import * as http from 'http'
import * as socket from '../sockets/sockets'
import router from '../routes/router';
import { Eventos } from '../sockets/eventos.enum';

export default class Server{
    public app:express.Application;
    public PORT:number = 3000;
    public io : socketIO;
    private httpServer:http.Server;
    private static _instance?: Server
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

        //configuracion de compatibildiad de servidores
        this.httpServer = new http.Server(this.app);
        
        //sockets
        this.io = new socketIO(this.httpServer,{cors:{origin:true, credentials:true}});
        this.escucharSockets()
        if (Server._instance)
         throw new Error("Use Singleton.instance");
         Server._instance = this;
    }

    start( callback:any ){
        this.httpServer.listen(this.app.get('port'), callback);
    }

 
    public static get instance() {

        return Server._instance;
    }

    private escucharSockets(){

          this.io.on(Eventos.CONECTAR, cliente => {
            console.log("cliente conectado");
            
           socket.desconectar(cliente,this.io )
           socket.salaRestaurant(cliente,this.io )
          
            
            
        })


    }

}

export const ServerInstance = Server.instance;