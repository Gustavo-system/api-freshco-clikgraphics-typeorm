import "reflect-metadata";
import { createConnection } from "typeorm";
import { Server } from './configs/server';
import {Server as ServerIO} from 'socket.io'
async function main() {
    try {
        await createConnection();
        const server = new Server();
        server.start(()=>{
            console.log(`Servidor escuchando en el puerto ${server.app.get('port')}`);
        })
        const io = new ServerIO(3001,{cors:{origin:'*'}});
        io.on('connection', cliente => {
            console.log("cliente conectado");
            
            console.log(cliente.id);
            
        })
    } catch (err) {
        console.error('No se conecto a la base',err);
    }
}

main();
