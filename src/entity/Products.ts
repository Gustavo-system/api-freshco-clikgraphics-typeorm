import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BranchModel } from './Branch';
import { CategoriesModel } from './Categories';
import { AdicionalesModel } from './ProductosAdicionales';

@Entity({name:"Products"})

export class ProductModel {

    @PrimaryGeneratedColumn()
    id_product:number;

    @Column()
    name:string;

    @Column({nullable:true})
    description:string;

    @Column({nullable:true})
    price:number;

    @Column({nullable:true})
    discount:string;

    @Column({nullable:true})
    sizes:string;

    @Column({nullable:true})
    maximumQuantity:string;

    @Column({nullable:true, default:false})
    recommended:boolean;

    @Column({nullable:true, default:false})
    promotion:boolean;

    @Column({nullable:true, default:false})
    popular:boolean;

    @Column({nullable:true, default:false})
    new:boolean;

    @Column({nullable:true, default:false})
    vegan:boolean;

    @Column({nullable:true})
    image:string;

    @ManyToOne(type => BranchModel, (branch) => branch.products)
    @JoinColumn({name:'branch'})
    branch: BranchModel;

    @ManyToOne(type => CategoriesModel, (category) => category.products)
    @JoinColumn({name:'category'})
    category: CategoriesModel;

    @ManyToMany(type => AdicionalesModel, (adicionales) => adicionales.products)
    @JoinTable({name:'tr_adicionales'})
    adicionales: AdicionalesModel[];

}
