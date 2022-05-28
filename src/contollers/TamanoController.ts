import { getRepository } from "typeorm";
import { TamanoModel } from "../entity/Tamano";
import { responseMessage, responseData } from '../utils/responses';
import { Request, Response } from "express";

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
      if (!Tamano) {
        return responseMessage(res, 404, false, "Not Sizes");
      }
      let newTamano = getRepository(TamanoModel).create(Tamano);

      let resd =  await getRepository(TamanoModel).save(newTamano);
      return responseData(res, 200, 'Sizes successfull', {message:'OK',tamano:resd});
    } catch {
      return responseMessage(res, 500, false, "internal error");
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
        let result = await getRepository(TamanoModel).delete(req.params.id)
        if(result){
            return responseMessage(res, 404, false, "Not Found")
        }
        return responseData(res, 200, 'Sizes successfull', {message:'OK'});
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
