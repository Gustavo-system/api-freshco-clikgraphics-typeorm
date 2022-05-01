import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserModel } from './User';
import { OrdersModel } from './Orders';

@Entity({name:"Address"})

export class AddressModel {

    @PrimaryGeneratedColumn()
    id_address:number;

    @Column({type:"varchar", length:100})
    address:string;

    @Column({nullable:true})
    latitud:string;

    @Column({nullable:true})
    longitud:string

    @ManyToOne(type => UserModel, (user) => user.address)
    @JoinColumn({name:'id_user'})
    id_user: UserModel;

    @OneToMany( () => OrdersModel, order => order.address)
    orders:OrdersModel[]
    @Column({default:true})
    active:boolean;
}
