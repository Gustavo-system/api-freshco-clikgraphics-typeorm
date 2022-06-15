import { Socket } from "socket.io";
import { getRepository } from "typeorm";
import { UserModel } from "../entity/User";
import { wssUserList } from "./listaUsers";
import { wsUser } from "./usuarioSocket";
import { UserController } from "../contollers/UsersController";
import * as socketIO from "socket.io";
import { Eventos, Salas } from "./eventos.enum";
export const usuariosConectados = new wssUserList();

export const desconectar = (cliente: Socket, io: socketIO.Server) => {
  cliente.on(Eventos.DESCONECTAR, () => {
    usuariosConectados.deleteUser(cliente.id);
   // console.log("desconectado");
   // io.emit("usuarios-activos", usuariosConectados.getLista());
  });
};

export const salaRestaurant = (cliente: Socket, io: socketIO.Server) => {
  cliente.on(Eventos.CONFIGUSER, async ({ id }) => {
    let sala = "";
    const user: UserModel = await UserController.getUser(id);

    if (user) {
      switch (user.role) {
        case "ADMIN":
          cliente.join(Salas.ADMIN);
          sala = Salas.ADMIN;
          break;
        case "COLABORADOR":
          cliente.join(Salas.ADMIN);
          sala = Salas.ADMIN;
          break;
        case "GERENTE":
          cliente.join(Salas.ADMIN);
          sala = Salas.ADMIN;
          break;
        case "DELIVERY":
          
          cliente.join(Salas.DELIVERY);
          sala = Salas.DELIVERY;
          break;

        default:
          cliente.join(Salas.CUSTOMER);
          sala = Salas.CUSTOMER;
          break;
      }

      let wsUser: wsUser = {
        id:Number(id),
        idBranch: -1,
        sala,
        wsId: cliente.id,
      };
      if( user.branch){
        wsUser.idBranch =  user.branch.id_branch 
      }

      usuariosConectados.agregar(wsUser);
      console.log(usuariosConectados.getLista());
      
    }
  
  });
};

export const delivery = (cliente: Socket, io: socketIO.Server) => {
  cliente.on(Eventos.DELIVERY, async (payload) => {
    if (payload.to === undefined || payload.to === null) {
      io.in(Salas.DELIVERY).emit(Eventos.DELIVERY,payload);
    } else {
      let user = usuariosConectados.getUser(payload.to);
      if (user) {
        io.in(user.wsId).emit(Eventos.DELIVERY, payload);
      }
    }
  });
};

export const customer = (cliente: Socket, io: socketIO.Server) => {
  cliente.on(Eventos.CUSTOMER, async (payload) => {
    if (payload.to === undefined || payload.to === null) {
      io.in(Salas.CUSTOMER).emit(Eventos.CUSTOMER,payload);
    } else {
      let user = usuariosConectados.getUser(payload.to);
      if (user) {
        io.in(user.wsId).emit(Eventos.CUSTOMER, payload);
      }
    }
  });
};

export const admin = (cliente: Socket, io: socketIO.Server) => {
  cliente.on(Eventos.ADMIN, async (payload) => {
    if (payload.to === undefined || payload.to === null) { 
      io.in(Salas.ADMIN).emit(Eventos.ADMIN,payload);
    } else {
      if(payload.branch){
        let emits = usuariosConectados.findAdminsByBranch(payload.branch);
        if (emits.length > 0) {
          for (let i = 0; i < emits.length; i++) {
            io.in(emits[i].wsId).emit(Eventos.ADMIN, payload);
          }
        }
      }else{
        let user = usuariosConectados.getUser(payload.to);
        if (user) {
          io.in(user.wsId).emit(Eventos.ADMIN, payload);
        }
      }
  
    }
  });
};
