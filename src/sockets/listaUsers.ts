import { Salas } from './eventos.enum';
import { wsUser } from './usuarioSocket';
export class wssUserList {

    private lista:wsUser[] = [];


    constructor() {

    }

    public agregar (user:wsUser){
        this.lista.push(user)
        return user
    }

    public actualizar(user:Partial<wsUser>){
        this.lista.map( u => u.id === user.id ? user : u )
    }

    public getLista(){
        return this.lista
    }

    public getUser(id:number){

        return this.lista.find( u => u.id === id)
    }

    public getColaboradores(){
        return this.lista.filter( u => u.sala === Salas.ADMIN)
    }

    public getDelivery(){
        return this.lista.filter( u => u.sala === Salas.DELIVERY)
    }

    public getCustomers(){
        return this.lista.filter( u => u.sala === Salas.CUSTOMER)
    }

    public deleteUser(wsId:string){
        this.lista = this.lista.filter( u => u.wsId !== wsId)
        console.log(this.lista);
        
    }

    public findAdminsByBranch(id:number) {

        let results = this.lista.filter( u => u.sala === Salas.ADMIN && u.idBranch ===id)
        if (results.length <0){
            return []
        }else
        return results
    }

}