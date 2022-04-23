import { Socket } from "socket.io";
import { getRepository } from 'typeorm';
import { UserModel } from '../entity/User';
import { wssUserList } from './listaUsers';
import { wsUser } from './usuarioSocket';
import { UserController } from '../contollers/UsersController';
import * as socketIO from 'socket.io';
export const usuariosConectados = new wssUserList();


export const desconectar = (cliente:Socket,io:socketIO.Server ) => {

    cliente.on('disconnect', () => {
        usuariosConectados.deleteUser(cliente.id)
        console.log("desconectado");
        io.emit('usuarios-activos', usuariosConectados.getLista() );
    })
}



export const salaRestaurant =  (cliente:Socket,io:socketIO.Server ) => {
 console.log(cliente.id);
    cliente.on('salaRestaurant', async({id}) => {
        let sala = ''
        const  user = await UserController.getUser(id)

        if(user.role ==='ADMIN' || user.role === 'COLABORADOR'){
            console.log('conectado a sala de colaborador');
            
            cliente.join('salaRestaurant-Colaborador')
            sala= 'salaRestaurant-Colaborador' 
          }
        else if (user.role =="DELIVERY"){
            console.log('conectado a sala de delivery');
            cliente.join('salaRestaurant-Delivery')
            sala= 'salaRestaurant-Delivery'
        }  
          else{
            console.log('conectado a sala de clientes');
              cliente.join('salaRestaurant-Customer')
              sala= 'salaRestaurant-Customer'
          }
          const wsUser:wsUser ={
            id,
            idBranch: user.branch[0].id_branch,
            sala,
            wsId:cliente.id
        }
        
        usuariosConectados.agregar(wsUser);
    })
   
}

