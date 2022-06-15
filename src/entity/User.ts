import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { AddressModel } from './Address';
import { BranchModel } from './Branch';
import { OrdersModel } from './Orders';
import { DeliveryManModel } from './DeliveryMan';

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

    @Column({default:0.0,type:'double'})
    wallet:number;
      
    @OneToMany(type => AddressModel, (address) => address.id_user)
    address: AddressModel[];

    @OneToMany(type => OrdersModel, (order) => order.user)
    orders: OrdersModel[];

    @ManyToOne(type => BranchModel, (branch) => branch.user,{ onDelete: 'CASCADE' })
    branch: BranchModel;
    
    @OneToOne(type => DeliveryManModel, dm => dm.id_user,{nullable:true,onDelete:'CASCADE'})
    @JoinColumn()
    delivery:DeliveryManModel;

}
