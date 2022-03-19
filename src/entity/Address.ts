import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserModel } from './User';

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

}
