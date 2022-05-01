import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ProductModel } from './Products';
import { OrdersModel } from './Orders';
import { BranchModel } from './Branch';

@Entity({name:"Cupones"})
export class CuponesModel {

    @PrimaryGeneratedColumn()
    id_coupon:number;
    @Column({unique:true})
    name:string;
    @Column({default:true})
    active:boolean;
    @Column()
    date:string
    @Column()
    description:string
    @Column({default:1})
    uses:number
    @ManyToMany(type => ProductModel, (product) => product.cupon)
    products: ProductModel[];
    @Column({default:false, nullable:true})
    allProducts:boolean
    @Column()
    discount:number
    @Column({default:false})
    percentage:boolean
    @OneToMany( () => OrdersModel, order => order.cupon)
    orders:OrdersModel[]
    @ManyToOne( () => BranchModel)
    branch:BranchModel
    
}
