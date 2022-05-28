import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { DeliveryManModel } from './DeliveryMan';
import { BranchModel } from './Branch';
import { UserModel } from './User';
import { AddressModel } from './Address';
import { CuponesModel } from './Cupones';

@Entity({name:"Orders"})

export class OrdersModel {

    @PrimaryGeneratedColumn()
    id_order:number;

    @Column({type:"date", nullable:true})
    date:string;
    
    @Column({type:"text", nullable:true})
    products:string

    // @Column({type:"text"})
    // address:string

    @Column({type:"float"})
    subtotal:number

    @Column({type:"float"})
    total:number;

    @Column({type:"float",default:0})
    moneyUsed:number;

    @Column({type:"text"})
    comentario_branch:string;

    @Column({type:"text"})
    comentario_deliveryman:string;

    @Column({type:"boolean", default:false, nullable:true})
    pagado:boolean

    @Column({type:"boolean", default:false, nullable:true})
    accepted:boolean

    @Column({type:"boolean", default:false, nullable:true})
    cancelado:boolean

    @Column({type:"boolean", default:false, nullable:true})
    prepared:boolean

    @Column({type:"boolean", default:false, nullable:true})
    ready:boolean

    @Column({type:"boolean", default:false, nullable:true})
    on_way:boolean

    @Column({type:"boolean", default:false, nullable:true})
    finalized:boolean

    @Column({type:"boolean", default:false, nullable:true})
    ordena_recoje:boolean

    @Column({type:"varchar", length:50})
    payment_type:string

    @Column({type:"boolean", default:false, nullable:true})
    delivery_assigned:boolean

    @Column({type:"varchar", length:50})
    pin:string

    @Column({type:"boolean", default:false, nullable:true})
    verified_pin:boolean

    @ManyToOne(type => BranchModel, (branch) => branch.orders)
    branch: BranchModel;

    @ManyToOne(type => DeliveryManModel, (delivery) => delivery.orders)
    delivery : DeliveryManModel;

    @ManyToOne(type => UserModel, (user) => user.id_user)
    user : UserModel;

    @ManyToOne(() => AddressModel, address => address.orders)
    address: AddressModel;

    @ManyToOne(() => CuponesModel, cupon => cupon.orders)
    cupon: CuponesModel;
    @Column({default:true})
    active:boolean;
}
