import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';
import { ProductModel } from './Products';
import { UserModel } from './User';
@Entity({name:"Quejas"})

export class QuejasModel {

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => UserModel)
    idUser:UserModel;

    @Column({nullable:true})
    title:string;
    @Column({nullable:true})
    description:string;
  
}