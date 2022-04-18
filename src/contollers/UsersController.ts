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
            model.forEach(u => { delete u.password; delete u.token})
            return responseData(resp, 200, message, model);
        }catch(err){
            console.log(err);
            return responseMessage(resp, 400, false, 'Bad request');
        }
    }

    static post = async (req:Request, resp:Response):Promise<Response> => {
        try{
            const customId = uuidv4();
            const { password, branch = [] } = req.body;
            let AllBranchForThis:any[] = [];
  
            if(branch.length > 0){

                for (let i = 0; i < branch.length; i++) {
                    const id_branch = branch[i];
                    console.log(id_branch);
                    const Branch = await getRepository(BranchModel).findOne({where:{id_branch:id_branch}});
                    AllBranchForThis.push(Branch);
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
                address:[],
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
            const model = await getRepository(UserModel).findOne(req.params.id, {relations:["address", "orders", "branch"]});
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
            const model = await getRepository(UserModel).findOne(req.body.id_user);
            if(!model) return responseMessage(resp, 200, false, 'Not Found');

            // const deleteBranchs = await getRepository()
console.log(req.body);

            const { branch = [], changePassword = false } = req.body;
            let AllBranchForThis:any[] = [];

            if(branch.length > 0){

                for (let i = 0; i < branch.length; i++) {
                    const id_branch = branch[i];
                    console.log(id_branch);
                    const branchs = await getRepository(BranchModel).findOne({where:{id_branch}});
                    console.log(branchs);
                    
                    req.body.branch = branchs
                    console.log(req.body.branch,"branch");
                    
                }
            }

            let result = Object.assign(model,req.body);

            const user = await getRepository(UserModel).save(result);
            delete user.password
            delete user.token
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

    static disabled = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(UserModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')
            model.active=false;
            await getRepository(UserModel).update(req.params.id,model);
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

}