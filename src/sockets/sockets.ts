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
  console.log(cliente.id);
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

      const wsUser: wsUser = {
        id,
        idBranch: user.branch[0].id_branch ?? -1,
        sala,
        wsId: cliente.id,
      };

      usuariosConectados.agregar(wsUser);
      console.log(usuariosConectados.getLista());
      
    }
  
  });
};

export const delivery = (cliente: Socket, io: socketIO.Server) => {
  cliente.on(Eventos.DELIVERY, async (payload) => {
    if (payload.to === undefined || payload.to === null) {
      io.in(Salas.DELIVERY).emit(payload);
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
      io.in(Salas.CUSTOMER).emit(payload);
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
      io.in(Salas.ADMIN).emit(payload);
    } else {
      let emits = usuariosConectados.findAdminsByBranch(payload.branch);
      if (emits.length > 0) {
        for (let i = 0; i < emits.length; i++) {
          io.in(emits[i].wsId).emit(Eventos.ADMIN, payload);
        }
      }
    }
  });
};
