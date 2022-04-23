import { wsUser } from './usuarioSocket';
export class wssUserList {

    private lista:wsUser[] = [];


    constructor() {

    }

    public agregar (user:wsUser){
        this.lista.push(user)
        console.log(this.lista);
        
        return user
    }

    public actualizar(user:Partial<wsUser>){
        this.lista.map( u => u.id === user.id ? user : u )
        console.log(this.lista );
        
    }

    public getLista(){
        return this.lista
    }

    public getUser(id:number){
        return this.lista.find( u => u.id === id)
    }

    public getColaboradores(){
        return this.lista.filter( u => u.sala === 'salaRestaurant-Colaborador')
    }

    public getDelivery(){
        return this.lista.filter( u => u.sala === 'salaRestaurant-Delivery')
    }

    public getCustomers(){
        return this.lista.filter( u => u.sala === 'salaRestaurant-Customer')
    }

    public deleteUser(wsId:string){
        this.lista = this.lista.filter( u => u.wsId !== wsId)
        console.log(this.lista);
        
    }

}