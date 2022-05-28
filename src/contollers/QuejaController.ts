import { getRepository } from "typeorm";
import { responseMessage, responseData } from '../utils/responses';
import { Request, Response } from "express";
import { QuejasModel } from '../entity/Quejas';

export class QuejasController {
  static getAll = async (req: Request, res: Response) => {
    try {
      let quejas =  await getRepository(QuejasModel).find();
      return responseData(res, 200, 'complaints successfull', {message:'OK',quejas});
    } catch {
      return responseMessage(res, 500, false, "internal error");
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      let Tamano = req.body.tamano;
      if (!Tamano) {
        return responseMessage(res, 404, false, "Not Tamano");
      }
      let newTamano = getRepository(QuejasModel).create(Tamano);

      let resd =  await getRepository(QuejasModel).save(newTamano);
      return responseData(res, 200, 'complaints successfull', {message:'OK',queja:resd});
    } catch {
      return responseMessage(res, 500, false, "internal error");
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
        let result = await getRepository(QuejasModel).delete(req.params.id)
        if(result){
            return responseMessage(res, 404, false, "Not Found")
        }
        return responseData(res, 200, 'complaints successfull', {message:'OK'});
    } catch  {
        return responseMessage(res, 500, false, "internal error");
    }

  };

  static update = async (req: Request, res: Response) => {
    try {
        let Tamano = req.body.tamano;
        let tan = await getRepository(QuejasModel).findOne(req.params.id);
        if (!Tamano || !tan) {
            return responseMessage(res, 404, false, "Not Tamano");
          }
          getRepository(QuejasModel).merge(tan,Tamano);
          let resd = await      getRepository(QuejasModel).save(tan);
        return responseData(res, 200, 'complaints successfull', {message:'OK',queja:resd});
    } catch  {
        return responseMessage(res, 500, false, "internal error");
    }

  };
}
