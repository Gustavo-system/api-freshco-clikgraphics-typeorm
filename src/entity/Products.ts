import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BranchModel } from './Branch';
import { CategoriesModel } from './Categories';
import { CuponesModel } from './Cupones';
import { AdicionalesModel } from './ProductosAdicionales';
import { TamanoModel } from './Tamano';

@Entity({name:"Products"})

export class ProductModel {

    @PrimaryGeneratedColumn()
    id_product:number;

    @Column()
    name:string;
    @Column({nullable:true})
    price:number;

    @Column({nullable:true})
    description:string;

    @Column({nullable:true})
    maximumQuantity:number;

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

    @Column({default:true})
    active:boolean;

    @ManyToOne(type => BranchModel, (branch) => branch.products, { onDelete: 'CASCADE' })
    branch: BranchModel;

    @ManyToOne(type => CategoriesModel, (category) => category.products,{ onDelete: 'CASCADE' })
    category: CategoriesModel;

    @ManyToMany(type => AdicionalesModel, (adicionales) => adicionales.products)
    @JoinTable()
    adicionales: AdicionalesModel[];

    @ManyToMany(type => CuponesModel, (cupon) => cupon.products)
    @JoinTable()
    cupon:CuponesModel

    @Column({default:0})
    sold:number

    @Column({default:false})
    hasSizes:boolean;

    @OneToMany( () => TamanoModel, t => t.product,{nullable:true})
    tamanos:TamanoModel[];

}
