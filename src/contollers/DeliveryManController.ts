import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { DeliveryManModel } from '../entity/DeliveryMan';
import { responseData, responseMessage } from '../utils/responses';

export class DeliveryManController{
    static get = async (req:Request, resp:Response):Promise<Response> => {
        try{
            let message:string = "OK"
            const model = await getRepository(DeliveryManModel).find();
            if(model.length == 0) message = 'Empty';
            return responseData(resp, 200, message, model);
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static post = async (req:Request, resp:Response):Promise<Response> => {
        try{
            const model = await getRepository(DeliveryManModel).create({
                model: req.body.model,
                seguro: req.body.seguro,
                phone: req.body.phone,
                photo_seguro : req.files['photo_seguro'] ? req.files['photo_seguro'][0].filename : 'sin_imagen.png',
                photo_licencia : req.files['photo_licencia'] ? req.files['photo_licencia'][0].filename : 'sin_imagen.png',
                id_user: req.body.id_user
            });
            await getRepository(DeliveryManModel).save(model);
            return responseMessage(resp, 201, true, 'Created');
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try{
            const model = await getRepository(DeliveryManModel).findOne(req.body.id);
            if(!model) return responseMessage(resp, 200, false, 'Not Found')
            return responseData(resp, 200, 'Datos obtenidos', model);
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try{
            const model = await getRepository(DeliveryManModel).findOne(req.body.id);
            if(!model) return responseMessage(resp, 200, false, 'Not Found');

            model.model = req.body.model;
            model.seguro = req.body.seguro;
            model.phone = req.body.phone;
            model.photo_seguro = req.files['photo_seguro'][0].filename;
            model.photo_licencia = req.files['photo_licencia'][0].filename;
            model.id_user = req.body.id_user;

            await getRepository(DeliveryManModel).save(model);
            return responseMessage(resp, 200, true, 'successful update');
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static delete = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(DeliveryManModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            await getRepository(DeliveryManModel).delete(req.params.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

}