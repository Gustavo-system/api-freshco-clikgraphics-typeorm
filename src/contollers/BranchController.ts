import { Request, Response } from 'express';
import { responseMessage, responseData } from '../utils/responses';
import { getRepository } from 'typeorm';
import { BranchModel } from '../entity/Branch';
export class BranchController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            const model = await getRepository(BranchModel).find({relations:["products", "categories"]});
            if(model.length == 0) message = 'Empty';
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
                online: (req.body.online == true || req.body.online == 1) ? true : false ,
                rate: req.body.rate,
                // image: req.file ? req.file.filename : null,
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
            const model = await getRepository(BranchModel).findOne(req.params.id, {relations:["products", "categories"]});
            if(!model) return responseMessage(resp, 404, false, 'Not Found');
            return responseData(resp, 200, 'OK', model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 500, false, 'Bad Request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(BranchModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            model.name = req.body.name;
            model.address = req.body.address;
            model.shippingCost = req.body.shippingCost;
            model.minimumCost = req.body.minimumCost;
            model.deliveryType = req.body.deliveryType;
            model.paymentMethod = req.body.paymentMethod;
            model.online = (req.body.online == true || req.body.online == 1) ? true : false;
            model.rate = req.body.rate;
            // model.image = req.file ? req.file.filename : model.image;

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