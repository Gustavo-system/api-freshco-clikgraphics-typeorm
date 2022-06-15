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


    @Column({default:'sin_imagen.png'})
    photo_delivery:string
    @Column()
    placas:string;
    @Column()
    color:string;
    @Column()
    marca:string;

    @OneToOne(type => UserModel, {
        eager: true,
        onDelete:"CASCADE"
    })
    @JoinColumn({name:"id_user"})
    id_user: UserModel;

    @OneToMany(type => OrdersModel, (order) => order.delivery)
    orders: OrdersModel[];
    @Column({default:false})
    active:boolean;
}
