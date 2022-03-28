import { Request, Response } from 'express';
import { responseMessage, responseData } from '../utils/responses';
import { getRepository } from 'typeorm';
import { AdicionalesModel } from '../entity/ProductosAdicionales';

export class AdicionalesController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            const model = await getRepository(AdicionalesModel).find({relations:["product"]});
            if(model.length == 0) message = 'Empty';
            return responseData(resp, 200, message, model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Internal Server Error');
        }
    }

    static post = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = getRepository(AdicionalesModel).create({
                name: req.body.name,
                price: req.body.price,
                product: req.body.product
            });
            const adicional = await getRepository(AdicionalesModel).save(model);
            return responseData(resp, 200, 'Created', adicional);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(AdicionalesModel).findOne(req.params.id, {relations:["product"]});
            if(!model) return responseMessage(resp, 404, false, 'Not Found');
            return responseData(resp, 200, 'Datos obtenidos', model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try {
    
            const model = await getRepository(AdicionalesModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found');

            model.name = req.body.name;
            model.price = req.body.price;
            model.product = req.body.product;

            const adicional = await getRepository(AdicionalesModel).save(model);
            return responseData(resp, 201, 'successful update', adicional);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static delete = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(AdicionalesModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            await getRepository(AdicionalesModel).delete(req.params.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

}