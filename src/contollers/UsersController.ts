import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { UserModel } from "../entity/User";
import { responseData, responseMessage } from '../utils/responses';

import { v4 as uuidv4 } from 'uuid';
import { encrypted } from "../utils/helpers/helpers";
import { BranchModel } from '../entity/Branch';

export class UserController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try{
            let message:string = "OK"
            const model = await getRepository(UserModel).find({relations:["address", "orders", "branch"]});
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
            const { password, branchs = [] } = req.body;
            let AllBranchForThis:any[] = [];

            if(branchs.length > 0){

                for (let i = 0; i < branchs.length; i++) {
                    const id_branch = branchs[i];
                    console.log(id_branch);
                    const branch = await getRepository(BranchModel).findOne({where:{id_branch:id_branch}});
                    AllBranchForThis.push(branch);
                }
            }

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
                branch: AllBranchForThis,
                pendingOrder: req.body.pendingOrder,
                image: req.file ? req.file.filename : 'sin_imagen.png',
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
            const model = await getRepository(UserModel).findOne(req.body.id, {relations:["address", "orders", "branch"]});
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

            // const deleteBranchs = await getRepository()

            const { branchs = [], changePassword = false } = req.body;
            let AllBranchForThis:any[] = [];

            if(branchs.length > 0){

                for (let i = 0; i < branchs.length; i++) {
                    const id_branch = branchs[i];
                    console.log(id_branch);
                    const branch = await getRepository(BranchModel).findOne({where:{id_branch}});
                    AllBranchForThis.push(branch);
                }
            }

            console.log(AllBranchForThis);

            if(changePassword){
                console.log('cambio la password');
                model.password = req.body.password;
            }

            model.names = req.body.names;
            model.phone = req.body.phone;
            model.email = req.body.email;
            model.username = req.body.username;
            model.role = req.body.role;
            model.active = req.body.active ? req.body.active : true;
            model.notificationsEnabled = req.body.notificationsEnabled ? req.body.notificationsEnabled : false;
            model.birthday = req.body.birthday;
            model.branch = AllBranchForThis;
            model.image = req.file ? req.file.fieldname : model.image;

            console.log(model);

            const user = await getRepository(UserModel).save(model);
            return responseMessage(resp, 200, true, 'successful update', user);
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

            await getRepository(UserModel).delete(req.params.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

}