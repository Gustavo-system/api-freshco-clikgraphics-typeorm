import { Request, Response } from 'express';
import { responseMessage, responseData } from '../utils/responses';
import { getRepository } from 'typeorm';
import { ProductModel } from '../entity/Products';

export class ProductsController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            const model = await getRepository(ProductModel).find({relations:["branch", "category"]});
            if(model.length == 0) message = 'Empty';
            return responseData(resp, 200, message, model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Internal Server Error');
        }
    }

    static post = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = getRepository(ProductModel).create({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                discount: req.body.discount,
                sizes: req.body.sizes,
                maximumQuantity: req.body.maximumQuantity,
                recommended: (req.body.recommended == true || req.body.recommended == 1 ) ? true : false,
                promotion: (req.body.promotion == true || req.body.promotion == 1) ? true : false,
                popular: (req.body.popular == true || req.body.popular == 1) ? true : false,
                new: (req.body.new == true || req.body.new == 1) ? true : false,
                vegan: (req.body.vegan == true || req.body.vegan == 1) ? true : false,
                category: req.body.category,
                image: req.file.filename
            });
            await getRepository(ProductModel).save(model);
            return responseMessage(resp, 201, true, 'Created');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(ProductModel).findOne(req.params.id, {relations:["products", "categories"]});
            if(!model) return responseMessage(resp, 404, false, 'Not Found');
            return responseData(resp, 200, 'Datos obtenidos', model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(ProductModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            model.name = req.body.name;
            model.description = req.body.description;
            model.category = req.body.category;
            model.price = req.body.price;
            model.discount = req.body.discount;
            model.sizes = req.body.sizes;
            model.maximumQuantity = req.body.maximumQuantity;
            model.recommended = (req.body.recommended == true || req.body.recommended == 1) ? true : false;
            model.promotion = (req.body.promotion == true || req.body.promotion == 1) ? true : false;
            model.popular = (req.body.popular == true || req.body.popular == 1) ? true : false;
            model.new = (req.body.new == true || req.body.new == 1) ? true : false;
            model.vegan = (req.body.vegan == true || req.body.vegan == 1) ? true : false;
            model.image = req.file.filename

            await getRepository(ProductModel).save(model);
            return responseMessage(resp, 201, true, 'successful update');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static delete = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(ProductModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            await getRepository(ProductModel).delete(req.body.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

}