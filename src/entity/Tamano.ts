import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';
import { ProductModel } from './Products';
@Entity({name:"Tamano"})

export class TamanoModel {

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => ProductModel, prd => prd.tamanos, { onDelete: 'CASCADE' })
    product:ProductModel;

    @Column({nullable:true})
    name:string;

    @Column({nullable:true})
    price:number;
  
}