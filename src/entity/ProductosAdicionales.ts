import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ProductModel } from './Products';

@Entity({name:"Products_Adicionales"})

export class AdicionalesModel {

    @PrimaryGeneratedColumn()
    id_product_extra:number;

    @Column({type:"text"})
    name:string;

    @Column({type:"float"})
    price:number;

    @ManyToOne(type => ProductModel, (product) => product.adicionales)
    @JoinColumn({name:'product'})
    product: ProductModel;

}
