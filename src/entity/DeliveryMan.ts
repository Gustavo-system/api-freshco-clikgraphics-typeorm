import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserModel } from './User';

@Entity({name:"Delivery_man"})

export class DeliveryManModel {

    @PrimaryGeneratedColumn()
    id_delivery:number;

    @Column({type:"varchar", length:100})
    model:string;

    @Column({nullable:true})
    seguro:string;

    @Column({nullable:true})
    phone:string

    @Column({nullable:true})
    photo_seguro:string
    
    @Column({nullable:true})
    photo_licencia:string

    @Column({nullable: false, unique: true})
    @OneToOne(type => UserModel, {
        eager: true,
    })
    @JoinColumn({name:"id_user"})
    id_user: UserModel;

}
