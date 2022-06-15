import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { UserModel } from "../entity/User";
import { responseData, responseMessage } from '../utils/responses';

import { v4 as uuidv4 } from 'uuid';
import { encrypted } from "../utils/helpers/helpers";
import { BranchModel } from '../entity/Branch';
import { orderProduct } from "./OrderController";
import { AdicionalesModel } from '../entity/ProductosAdicionales';
import { ProductModel } from '../entity/Products';

export class UserController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try{
            let message:string = "OK"
            const model = await getRepository(UserModel).find({relations:["branch"]});
            if(model.length == 0) message = 'Empty';
            model.forEach(u => delete u.password)

            return responseData(resp, 200, message, model);
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }


    static delivery = async (req:Request, resp:Response):Promise<Response> => {
        try{
            let message:string = "OK"
            const model = await getRepository(UserModel).find({relations:["branch","delivery"]});
            if(model.length == 0) message = 'Empty';
            model.forEach(u => delete u.password)

            return responseData(resp, 200, message, model);
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static post = async (req:Request, resp:Response):Promise<Response> => {
        try{
            let { password  } = req.body;
            console.log(req.body);
            let branch;

            if(req.body.role === "CUSTOMER" && req.body.branch){
                delete req.body.branch
            }
            if(req.body.branch){
                branch = await getRepository(BranchModel).findOne(branch);
            }
            const hash_password = await encrypted(password);
            const model = getRepository(UserModel).create({
                names: req.body.names,
                phone: req.body.phone,
                email: req.body.email,
                password: hash_password,
                role: req.body.role,
                notificationsEnabled: req.body.notificationsEnabled,
                birthday: req.body.birthday,
                address:[] ,
                branch:branch ?? null,
                pendingOrder: req.body.pendingOrder,
                image: req.file ? req.file.filename : 'freshco.png',
                orders:[]
            });
            const user = await getRepository(UserModel).save(model);
            delete user.password;
            return responseData(resp, 200, 'Datos obtenidos', user);
        }catch(err){
            console.log(err);
            if(err.code === 'ER_DUP_ENTRY'){
                return responseMessage(resp, 400, false,'email was used in other account ');
            }
            return responseMessage(resp, 500, false, 'Bad request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try{
 
            const model = await getRepository(UserModel).findOne(req.params.id, {relations:["address", "orders", "branch"]});
            
            if(!model) return responseMessage(resp, 200, false, 'Not Found')
            model.password = "";
                    let result = []            
                for(let j =0; j<model.orders.length; j++){
                    let a:orderProduct[] = JSON.parse(JSON.parse(model.orders[j].products)) ?? []
                    let prods = await this.getProductsOrders(a)
                    let orden:any = model.orders[j]
                    orden.products = prods
                   
                    result.push(orden)
                }
                let user = model;
                user.orders = result
        
            return responseData(resp, 200, 'Datos obtenidos', user);
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try{
            const model = await getRepository(UserModel).findOne(req.body.id_user,{relations:["address", "orders", "branch"]});
            if(!model) return responseMessage(resp, 200, false, 'Not Found');


            let result = getRepository(UserModel).merge(model,req.body);

            await getRepository(UserModel).save(result);
            delete result.password
            let orders = []
            for(let j =0; j<model.orders.length; j++){
                let a:orderProduct[] = JSON.parse(JSON.parse(model.orders[j].products)) ?? []
                let prods = await this.getProductsOrders(a)
                let orden:any = model.orders[j]
                orden.products = prods
               
                orders.push(orden)
            }
            result.orders;
      
            
            return responseMessage(resp, 200, true, 'successful update', {user:result});
            // return responseMessage(resp, 200, true, 'ok');
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static delete = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(UserModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')
            model.active=false
            await getRepository(UserModel).delete(req.params.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static disabled = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(UserModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')
            model.active=false;
            await getRepository(UserModel).delete(req.params.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static changePassword = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(UserModel).findOne(req.body.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')
            const hash_password = await encrypted(req.body.password);
            model.password=hash_password;
            await getRepository(UserModel).update(req.body.id,model);
            return responseMessage(resp, 201, true, 'was successfully updated');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static getProductsOrders = async (Array: orderProduct[]) => {

        let result:any[] = [];
        for(let i =0 ; i < Array.length; i++){
            if(Array[i].isAdicional){
                let idProduct = await getRepository(AdicionalesModel).findOne(Array[i].idProduct)
                 let res = {
                     cantidad:Array[i].cantidad,
                     idProduct,
                     isAdicional:Array[i].isAdicional
                 }
                 result.push( res)
             }else{
                 let idProduct = await getRepository(ProductModel).findOne(Array[i].idProduct)           
                let res = {
                     cantidad:Array[i].cantidad,
                     idProduct,
                     isAdicional:Array[i].isAdicional,
                     size:Array[i].size ?? null,
                     hasSize:Array[i].hasSize ?? null
                 }
                 result.push(res)
               
             }


        }
    
        
       return  result
    }


    static getUser = async (id:number):Promise<any> => {
        try{
            return await getRepository(UserModel).findOne(id, {relations:["address", "orders", "branch"]});
         
        }catch(err){
            console.log(err);
        }
    }



}