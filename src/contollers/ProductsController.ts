import { Request, Response } from 'express';
import { responseMessage, responseData } from '../utils/responses';
import { getRepository } from 'typeorm';
import { ProductModel } from '../entity/Products';
import { AdicionalesModel } from '../entity/ProductosAdicionales';
import { BranchModel } from '../entity/Branch';
import { CategoriesModel } from '../entity/Categories';

export class ProductsController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            let model:any = [];
            const { id_branch } = req.query;
            if(id_branch){
                model = await getRepository(ProductModel).find({where:{branch:id_branch}, relations:["branch", "category", "adicionales","cupon"]});
            }else{
                model = await getRepository(ProductModel).find({relations:["branch", "category", "adicionales","cupon"]});
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

            const { adicionales } = req.body;
            let productosAdicionales:any[] = [];

            if(adicionales.length > 0){
                for (let i = 0; i < adicionales.length; i++) {
                    const elemento = adicionales[i];
                    const adicional = await getRepository(AdicionalesModel).findOne({where:{id_product_extra:elemento}});
                    productosAdicionales.push(adicional);
                }
            }
         
            
            const model = getRepository(ProductModel).create({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                discount: req.body.discount,
                category:await getRepository(CategoriesModel).findOne(req.body.category),
                branch: await getRepository(BranchModel).findOne(req.body.branch),
                sizes: req.body.sizes,
                maximumQuantity: req.body.maximumQuantity,
                recommended: (req.body.recommended == true || req.body.recommended == 1 ) ? true : false,
                promotion: (req.body.promotion == true || req.body.promotion == 1) ? true : false,
                popular: (req.body.popular == true || req.body.popular == 1) ? true : false,
                new: (req.body.new == true || req.body.new == 1) ? true : false,
                vegan: (req.body.vegan == true || req.body.vegan == 1) ? true : false,
                image: req.file ? req.file.filename : 'sin_imagen.png',
                adicionales: productosAdicionales
            });

            // return resp.json(model);
            const product = await getRepository(ProductModel).save(model);
            return responseData(resp, 200, 'Created', product);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(ProductModel).findOne(req.params.id, {relations:["branch", "category", "adicionales"]});
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

            const { adicionales } = req.body;
            let productosAdicionales:any[] = [];

            if(adicionales.length > 0){
   
                for (let i = 0; i < adicionales.length; i++) {
                    const elemento = adicionales[i];
                    console.log(elemento);
                    
                    const adicional = await getRepository(AdicionalesModel).findOne({where:{id_product_extra:elemento}});
                    productosAdicionales.push(adicional);
                }
            }
       
            model.name = req.body.name;
            model.description = req.body.description;
            model.category = await getRepository(CategoriesModel).findOne(req.body.category),
            model.price = req.body.price;
            model.discount = req.body.discount;
            model.sizes = req.body.sizes;
            model.maximumQuantity = req.body.maximumQuantity;
            model.recommended = (req.body.recommended == true || req.body.recommended == 1) ? true : false;
            model.promotion = (req.body.promotion == true || req.body.promotion == 1) ? true : false;
            model.popular = (req.body.popular == true || req.body.popular == 1) ? true : false;
            model.new = (req.body.new == true || req.body.new == 1) ? true : false;
            model.vegan = (req.body.vegan == true || req.body.vegan == 1) ? true : false;
            model.adicionales = productosAdicionales
            model.image = req.file ? req.file.filename : model.image

            const product = await getRepository(ProductModel).save(model);
            return responseData(resp, 201, 'successful update', product);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static delete = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(ProductModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            await getRepository(ProductModel).delete(req.params.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }


    static disabled = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(ProductModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')
            model.active=false;
            await getRepository(ProductModel).update(req.params.id,model);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

}