import { Request, Response } from 'express';
import { responseMessage, responseData } from '../utils/responses';
import { getRepository } from 'typeorm';
import { CategoriesModel } from '../entity/Categories';

export class CategoriesController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            let model:any = [];
            const { id_branch } = req.query;
            if(id_branch){
                model = await getRepository(CategoriesModel).find({ where:id_branch ,relations:["branch", "products"]});

            }else{
                model = await getRepository(CategoriesModel).find({relations:["branch", "products"]});
            }
            if(model.length == 0) message = 'Empty';
            return responseData(resp, 200, message, model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Internal Server Error');
        }
    }

    static post = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = getRepository(CategoriesModel).create({
                name: req.body.name,
                id_branch: req.body.id_branch,
            });
            const categoria = await getRepository(CategoriesModel).save(model);
            // return responseMessage(resp, 201, true, 'Created');
            return responseData(resp, 200, 'Created', categoria);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(CategoriesModel).findOne(req.params.id, {relations:["products", "branch"]});
            if(!model) return responseMessage(resp, 404, false, 'Not Found');
            return responseData(resp, 200, 'Datos obtenidos', model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(CategoriesModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            model.name = req.body.name;
            model.id_branch = req.body.id_branch;

            const categoria = await getRepository(CategoriesModel).save(model);
            return responseData(resp, 200, 'successful update', categoria);

        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static delete = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(CategoriesModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            await getRepository(CategoriesModel).delete(req.params.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

}