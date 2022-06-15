import { getRepository } from "typeorm";
import { TamanoModel } from "../entity/Tamano";
import { responseMessage, responseData } from '../utils/responses';
import { Request, Response } from "express";
import { ProductModel } from '../entity/Products';

export class TamanoController {
  static getAll = async (req: Request, res: Response) => {
    try {
      let tamanos =  await getRepository(TamanoModel).find();
      return responseData(res, 200, 'Sizes successfull', {message:'OK',tamanos});
    } catch {
      return responseMessage(res, 500, false, "internal error");
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      let Tamano = req.body.tamano;
      let idProduct = req.body.product;
      if (!Tamano) {
        return responseMessage(res, 404, false, "Not Sizes");
      }
      let product = await getRepository(ProductModel).findOne(idProduct);
      product.hasSizes = true;
      await getRepository(ProductModel).save(product);
      for(let i =0 ; i < Tamano.length;i++){
          Tamano[i].product = product;
        let newTamano = getRepository(TamanoModel).create(Tamano);
         await getRepository(TamanoModel).save(newTamano);
      
      }
      product = await getRepository(ProductModel).findOne(idProduct,{relations:['adicionales',"tamanos"]});
      return responseData(res, 200, 'Sizes successfull', {message:'OK',product});
    } catch {
      return responseMessage(res, 500, false, "internal error");
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
        let result = await getRepository(TamanoModel).findOne(req.params.id,{relations:["product"]}); 
        if(!result){
          return responseMessage(res, 404, false, "Not Found")
      }
        let idprod = result.product.id_product;
        let out = await getRepository(TamanoModel).delete(req.params.id)
      console.log(out);
      
        if(!out){
            return responseMessage(res, 404, false, "Not Found")
        }
        let product = await getRepository(ProductModel).findOne(idprod,{relations:['adicionales',"tamanos"]});
        return responseData(res, 200, 'Sizes Deleted', {message:'OK',product});
    } catch  {
        return responseMessage(res, 500, false, "internal error");
    }

  };

  static update = async (req: Request, res: Response) => {
    try {
        let Tamano = req.body.tamano;
        let tan = await getRepository(TamanoModel).findOne(req.params.id);
        if (!Tamano || !tan) {
            return responseMessage(res, 404, false, "Not Sizes");
          }
          getRepository(TamanoModel).merge(tan,Tamano);
          let resd = await      getRepository(TamanoModel).save(tan);
        return responseData(res, 200, 'Sizes successfull', {message:'OK',tamano:resd});
    } catch  {
        return responseMessage(res, 500, false, "internal error");
    }

  };
}
