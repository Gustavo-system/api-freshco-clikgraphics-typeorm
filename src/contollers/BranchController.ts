import { Request, Response } from 'express';
import { responseMessage, responseData } from '../utils/responses';
import { getRepository } from 'typeorm';
import { BranchModel } from '../entity/Branch';
import { orderProduct } from './OrderController';
import { AdicionalesModel } from '../entity/ProductosAdicionales';
import { ProductModel } from '../entity/Products';
export class BranchController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            const model = await getRepository(BranchModel).find({relations:["products", "categories", "orders", "adicionales"]});
            if(model.length == 0) message = 'Empty';
            let result = [];
            let products = [];
            let total:any[] = []
            for(let i =0; i<model.length; i++){
                result = []
                products =[]
                for(let j =0; j<model[i].orders.length; j++){
                    let a:orderProduct[] = JSON.parse(JSON.parse(model[i].orders[j].products))
                    let prods = await this.getProductsOrders(a)
                    let orden:any = model[i].orders[j]
                    orden.products = prods
                    result.push(orden)
                }
                for(let j = 0 ; j<model[i].products.length; j++){
                   let product = await getRepository(ProductModel).findOne({id_product:model[i].products[j].id_product}, {relations:["branch", "category", "adicionales"]});
                   if(product){
                    products.push(product)
                   }
                   
                }
                let branchs = model[i];
                branchs.orders = result
                products = products.filter( prod => prod.active )
                branchs.products = products;
                total.push(branchs)
            }
            total = total.filter( m => m.online === true)
            return responseData(resp, 200, message, total);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 500, false, 'Bad Request');
        }
    }

    static post = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = getRepository(BranchModel).create({
                name: req.body.name,
                address: req.body.address,
                shippingCost: req.body.shippingCost,
                minimumCost: req.body.minimumCost,
                deliveryType: req.body.deliveryType,
                paymentMethod: req.body.paymentMethod,
                latitud:req.body.latitud,
                longitud: req.body.longitud,
                online: true,
                rate: req.body.rate,
                image: req.file ? req.file.filename : "sin_imagen.png",

            });
            const branch = await getRepository(BranchModel).save(model);
            return responseData(resp, 201, 'Created', branch);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 500, false, 'Bad Request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(BranchModel).findOne(req.params.id, {relations:["products", "categories", "orders", "adicionales"]});
            if(!model) return responseMessage(resp, 404, false, 'Not Found');
            let result = []
            let products =[]
            for(let j =0; j<model.orders.length; j++){
                result = []
                let a:orderProduct[] = JSON.parse(JSON.parse(model.orders[j].products))
                let prods = await this.getProductsOrders(a)
                let orden:any = model.orders[j]
                orden.products = prods
                result.push(orden)
            }
            for(let j = 0 ; j<model.products.length; j++){
                let product = await getRepository(ProductModel).findOne({id_product:model.products[j].id_product}, {relations:["branch", "category", "adicionales"]});
                if(product){
                 products.push(product)
                }
                
             }
            let branch = model;
            branch.orders = result
            products = products.filter( prod => prod.active )
            branch.products = products
            return responseData(resp, 200, 'OK', branch);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 500, false, 'Bad Request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let model = await getRepository(BranchModel).findOne(req.params.id,{relations:["products", "categories", "orders", "adicionales"]});
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

             model = Object.assign(model,req.body)
            const branch = await getRepository(BranchModel).save(model);
            return responseData(resp, 201, 'successfull update', branch);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 500, false, 'Bad Request');
        }
    }

    static delete = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(BranchModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            await getRepository(BranchModel).delete(req.params.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
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
                     isAdicional:Array[i].isAdicional
                 }
                 result.push(res)
               
             }


        }
    
        
       return  result
    }


}