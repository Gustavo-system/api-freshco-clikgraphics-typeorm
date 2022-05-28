import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserModel } from './User';
import { OrdersModel } from './Orders';

@Entity({name:"Delivery_man"})

export class DeliveryManModel {

    @PrimaryGeneratedColumn()
    id_delivery:number;

    @Column({type:"varchar", length:100})
    model:string;

    @Column({nullable:true})
    tipo_vehiculo:string;

    @Column({nullable:true})
    phone:string

    @Column({nullable:true})
    photo_seguro:string
    
    @Column({nullable:true})
    photo_licencia:string

    @OneToOne(type => UserModel, {
        eager: true,
    })
    @JoinColumn({name:"id_user"})
    id_user: UserModel;

    @OneToMany(type => OrdersModel, (order) => order.delivery)
    orders: OrdersModel[];
    @Column({default:true})
    active:boolean;
}
