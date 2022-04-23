import { Request, Response } from 'express';
import { responseMessage, responseData } from '../utils/responses';
import { getRepository } from 'typeorm';
import { AddressModel } from '../entity/Address';

export class AddressController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            let model:any = [];

            const { id_user } = req.query;
            if(id_user){
                model = await getRepository(AddressModel).find({where:{id_user}});
            }else{
                model = await getRepository(AddressModel).find();
            }
            if(model.length == 0) message = 'Empty';
            return responseData(resp, 200, message, model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 500, false, 'Internal Server Error');
        }
    }

    static post = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = getRepository(AddressModel).create({
                address: req.body.address,
                latitud: req.body.latitud,
                longitud: req.body.longitud,
                id_user: req.body.id_user
            });
            await getRepository(AddressModel).save(model);
            return responseMessage(resp, 201, true, 'Created');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(AddressModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found');
            return responseData(resp, 200, 'Datos obtenidos', model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(AddressModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            model.address = req.body.address ??  model.address,
            model.address = req.body.latitud ??  model.address,
            model.longitud = req.body.longitud ?? model.longitud,

            await getRepository(AddressModel).save(model);
            return responseMessage(resp, 201, true, 'successful update');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static delete = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(AddressModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            await getRepository(AddressModel).delete(req.params.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

}