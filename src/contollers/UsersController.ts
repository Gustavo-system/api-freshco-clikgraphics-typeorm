import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { UserModel } from "../entity/User";
import { responseData, responseMessage } from '../utils/responses';

import { v4 as uuidv4 } from 'uuid';
import { encrypted } from "../utils/helpers/helpers";

export class UserController{
    static get = async (req:Request, resp:Response):Promise<Response> => {
        try{
            let message:string = "OK"
            const model = await getRepository(UserModel).find({relations:["address"]});
            if(model.length == 0) message = 'Empty';
            return responseData(resp, 200, message, model);
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static post = async (req:Request, resp:Response):Promise<Response> => {
        try{
            const customId = uuidv4();
            const { password } = req.body;

            const hash_password = await encrypted(password);
            const model = getRepository(UserModel).create({
                names: req.body.names,
                phone: req.body.phone,
                email: req.body.email,
                password: hash_password,
                username: req.body.username,
                role: req.body.role,
                active: req.body.active,
                notificationsEnabled: req.body.notificationsEnabled,
                birthday: req.body.birthday,
                uuid: customId,
                branch: req.body.branch,
                pendingOrder: req.body.pendingOrder
                // image: req.file ? req.file.fieldname : null,
            });
            const user = await getRepository(UserModel).save(model);
            return responseData(resp, 200, 'Datos obtenidos', user);
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try{
            const model = await getRepository(UserModel).findOne(req.body.id, {relations:["address"]});
            if(!model) return responseMessage(resp, 200, false, 'Not Found')
            model.password = "";
            return responseData(resp, 200, 'Datos obtenidos', model);
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try{
            const model = await getRepository(UserModel).findOne(req.body.id);
            if(!model) return responseMessage(resp, 200, false, 'Not Found');

            model.names = req.body.names;
            model.phone = req.body.phone;
            model.email = req.body.email;
            model.password = req.body.password;
            model.username = req.body.username;
            model.role = req.body.role;
            model.active = req.body.active ? req.body.active : true;
            model.notificationsEnabled = req.body.notificationsEnabled ? req.body.notificationsEnabled : false;
            model.birthday = req.body.birthday;
            model.branch = req.body.branch;
            // model.image = req.file.fieldname;

            const user = await getRepository(UserModel).update({id_user:model.id_user},model);
            return responseMessage(resp, 200, true, 'successful update', user);
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static delete = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(UserModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            await getRepository(UserModel).delete(req.body.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

}