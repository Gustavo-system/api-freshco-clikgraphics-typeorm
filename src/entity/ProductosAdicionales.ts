import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, ManyToMany } from 'typeorm';
import { ProductModel } from './Products';

@Entity({name:"Products_Adicionales"})

export class AdicionalesModel {

    @PrimaryGeneratedColumn()
    id_product_extra:number;

    @Column({type:"text"})
    name:string;

    @Column({type:"float"})
    price:number;

    @ManyToMany(type => ProductModel, (product) => product.adicionales)
    products: ProductModel[];

}
