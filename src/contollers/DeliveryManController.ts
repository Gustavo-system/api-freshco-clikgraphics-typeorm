import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { DeliveryManModel } from '../entity/DeliveryMan';
import { responseData, responseMessage } from '../utils/responses';
import { UserModel } from '../entity/User';

export class DeliveryManController{
    static get = async (req:Request, resp:Response):Promise<Response> => {
        try{
            let message:string = "OK"
            let model = await getRepository(DeliveryManModel).find({relations:["orders"]});
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
                tipo_vehiculo: req.body.tipo_vehiculo,
                phone: req.body.phone,
                color:req.body.color,
                marca:req.body.marca,
                placas:req.body.placas,
                photo_delivery: req.files['photo_delivery'] ? req.files['photo_delivery'][0].filename : 'sin_imagen.png',
                photo_seguro : req.files['photo_seguro'] ? req.files['photo_seguro'][0].filename : 'sin_imagen.png',
                photo_licencia : req.files['photo_licencia'] ? req.files['photo_licencia'][0].filename : 'sin_imagen.png',
                id_user: await getRepository(UserModel).findOne(req.body.id_user) ?? null
            });
            const delivery = await getRepository(DeliveryManModel).save(model);
            return responseData(resp, 201, 'Created', delivery);
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'user has registred');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try{
            const model = await getRepository(DeliveryManModel).findOne(req.params.id, {relations:["orders"]});
            
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
            model.tipo_vehiculo = req.body.tipo_vehiculo;
            model.phone = req.body.phone;
            model.color=req.body.color,
            model.marca=req.body.marca,
            model.placas=req.body.placas,
            model.photo_delivery= req.files['photo_delivery'] ? req.files['photo_delivery'][0].filename : 'sin_imagen.png',
            model.photo_seguro = req.files['photo_seguro'][0].filename;
            model.photo_licencia = req.files['photo_licencia'][0].filename;
            model.id_user = req.body.id_user;

            const delivery = await getRepository(DeliveryManModel).save(model);
            // return responseMessage(resp, 200, true, 'successful update');
            return responseData(resp, 200, 'successful update', delivery)
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static active = async (req:Request, resp:Response):Promise<Response> => {
        try{
            const model = await getRepository(DeliveryManModel).findOne(req.body.id,{relations:["orders"]});
            if(!model) return responseMessage(resp, 200, false, 'Not Found');

            model.active = true;


            const delivery = await getRepository(DeliveryManModel).save(model);
            // return responseMessage(resp, 200, true, 'successful update');
            return responseData(resp, 200, 'successful active', delivery)
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static desactive = async (req:Request, resp:Response):Promise<Response> => {
        try{
            const model = await getRepository(DeliveryManModel).findOne(req.body.id,{relations:["orders"]});
            if(!model) return responseMessage(resp, 200, false, 'Not Found');

            model.active = false;


            const delivery = await getRepository(DeliveryManModel).save(model);
            // return responseMessage(resp, 200, true, 'successful update');
            return responseData(resp, 200, 'successful desactive', delivery)
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