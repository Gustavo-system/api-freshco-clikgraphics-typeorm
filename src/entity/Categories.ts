import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProductModel } from './Products';
import { BranchModel } from './Branch';

@Entity({name:"Categories"})

export class CategoriesModel {

    @PrimaryGeneratedColumn()
    id_category:number;

    @Column()
    name:string;
    @Column({default:true})
    active:boolean;

    @OneToMany(type => ProductModel, (product) => product.category)
    products: ProductModel[];

    @ManyToOne(type => BranchModel, (branch) => branch.categories, { onDelete: 'CASCADE' })
    id_branch: BranchModel;
    
}
