import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AddressModel } from './Address';

@Entity({name:"User"})
export class UserModel {

    @PrimaryGeneratedColumn()
    id_user:number;

    @Column()
    names:string;

    @Column()
    phone:string;

    @Column({unique:true})
    email:string

    @Column()
    password:string

    @Column({unique:true})
    username:string

    @Column({unique:false, nullable:true})
    token:string

    @Column()
    role:string

    @Column({default: true})
    active:boolean;

    @Column({nullable:true, default: false})
    notificationsEnabled:boolean;

    @Column({nullable:true})
    image:string;

    @Column({nullable:true})
    branchs:string;

    @Column({nullable:true, default:false})
    pendingOrder:boolean;

    @Column({nullable:true})
    birthday:string;

    @Column({nullable:true})
    uuid:string;

    @OneToMany(type => AddressModel, (address) => address.id_user)
    address: AddressModel[];

}
