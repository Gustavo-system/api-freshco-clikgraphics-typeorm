import { Request, Response } from 'express';
import { responseMessage, responseData } from '../utils/responses';
import { getRepository } from 'typeorm';
import { AdicionalesModel } from '../entity/ProductosAdicionales';
import { ProductModel } from '../entity/Products';

export class AdicionalesController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            const model = await getRepository(AdicionalesModel).find({relations:["products", "branch"]});
            if(model.length == 0) message = 'Empty';
            return responseData(resp, 200, message, model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Internal Server Error');
        }
    }

    static post = async (req:Request, resp:Response):Promise<Response> => {
        try {

            const { productos } = req.body;
            let productosAdicionales:any[] = [];

            for (let i = 0; i < productos.length; i++) {
                const elemento = productos[i];
                const producto = await getRepository(ProductModel).findOne({where:{id_product:elemento}});
                productosAdicionales.push(producto);
            }

            const model = getRepository(AdicionalesModel).create({
                name: req.body.name,
                price: req.body.price,
                products: productosAdicionales,
                branch: req.body.id_branch
            });
            const adicional = await getRepository(AdicionalesModel).save(model);
            return responseData(resp, 200, 'Created', adicional);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(AdicionalesModel).findOne(req.params.id, {relations:["products", "branch"]});
            if(!model) return responseMessage(resp, 404, false, 'Not Found');
            return responseData(resp, 200, 'Datos obtenidos', model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try {
    
            const model = await getRepository(AdicionalesModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found');

            const { products } = req.body;
            let productosAdicionales:any[] = [];

            if(products.length > 0){

                for (let i = 0; i < products.length; i++) {
                    const id_product = products[i];
                    const product = await getRepository(ProductModel).findOne({where:{id_product}});
                    productosAdicionales.push(product);
                }
            }

            model.name = req.body.name;
            model.price = req.body.price;
            model.products = productosAdicionales;

            const adicional = await getRepository(AdicionalesModel).save(model);
            return responseData(resp, 201, 'successful update', adicional);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static delete = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(AdicionalesModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            await getRepository(AdicionalesModel).delete(req.params.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }



    static disabled = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(AdicionalesModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')
                model.active=false;
            await getRepository(AdicionalesModel).update(req.params.id,model);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }


}