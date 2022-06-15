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
            let model = await getRepository(BranchModel).find();
            if(model.length == 0) message = 'Empty';

            model = model.filter( m => m.online === true)
            return responseData(resp, 200, message, model);
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
            const model = await getRepository(BranchModel).findOne(req.params.id, {relations:["products", "categories", "adicionales"]});

            if(!model) return responseMessage(resp, 404, false, 'Not Found');
            let result = []
            let products =[]

            for(let j = 0 ; j<model.products.length; j++){
                let product = await getRepository(ProductModel).findOne({where:{active:true,id_product:model.products[j].id_product},relations:["category", "adicionales","tamanos"]});
                if(product){
                 products.push(product)
                }
                
             }
            let branch = model;
            branch.products = products;
            return responseData(resp, 200, 'OK', branch);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 500, false, 'Bad Request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let model = await getRepository(BranchModel).findOne(req.params.id,{relations:["products", "categories", "adicionales"]});
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




}