import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { AddressModel } from './Address';
import { BranchModel } from './Branch';
import { OrdersModel } from './Orders';

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

    @Column({nullable:true, default:false})
    pendingOrder:boolean;

    @Column({nullable:true})
    birthday:string;

    @Column({nullable:true})
    uuid:string;

    @Column({default:0})
    wallet:number;
      
    @OneToMany(type => AddressModel, (address) => address.id_user)
    address: AddressModel[];

    @OneToMany(type => OrdersModel, (order) => order.user)
    orders: OrdersModel[];

    @ManyToMany(type => BranchModel, (branch) => branch.user)
    @JoinTable({name:'tr_usuario_branch'})
    branch: BranchModel[];

}
