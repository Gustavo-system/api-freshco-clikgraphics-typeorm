import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserModel } from './User';
import { OrdersModel } from './Orders';

@Entity({name:"Address"})

export class AddressModel {

    @PrimaryGeneratedColumn()
    id_address:number;

    @Column({type:"varchar", length:100})
    address:string;

    @Column({default:0.0000, type:'double'})
    latitud:string;

    @Column({default:0.0000, type:'double'})
    longitud:string

    @ManyToOne(type => UserModel, (user) => user.address, { onDelete: 'CASCADE' })
    id_user: UserModel;

    @OneToMany( () => OrdersModel, order => order.address)
    orders:OrdersModel[]


    @Column({default:true})
    active:boolean;
}
