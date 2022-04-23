import "reflect-metadata";
import { createConnection } from "typeorm";
import  Server  from './configs/server';
async function main() {
    try {
        await createConnection();
        const server = new Server();
        server.start(()=>{
            console.log(`Servidor escuchando en el puerto ${server.app.get('port')}`);
        })
    } catch (err) {
        console.error('No se conecto a la base',err);
    }
}

main();
