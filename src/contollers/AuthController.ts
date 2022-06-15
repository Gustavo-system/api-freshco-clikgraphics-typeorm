import { NextFunction, Request, Response} from 'express';
import { getRepository } from 'typeorm';
import { responseMessage, responseData } from '../utils/responses';
import * as jwt from 'jsonwebtoken';
import { compareEncrypted } from '../utils/helpers/helpers';
import { UserModel } from '../entity/User';

export interface IPayload {
    id_user: string;
    role:string;
    iat: number;
    exp:number;
} 

class AuthController{

    static login = async (req:Request, resp:Response):Promise<Response> => {

        const { email, password, username } = req.body;


        if((email == undefined && password == undefined) || (username == undefined && password == undefined)){
            return responseMessage(resp, 400, false, 'Se requieren credeciales');
        }

        try {

            let user:UserModel;
            if( email ){
                user = await getRepository(UserModel).findOne({where:{email}});
            }else{
                console.log('por usuario')
                user = await getRepository(UserModel).findOne({where:{username}});
            }

            if(!user){
                return responseMessage(resp, 404, false, 'Credenciales incorrecta');
            }

            const verify_password = await compareEncrypted(password, user.password);
            if(!verify_password){
                return responseMessage(resp, 400, false, 'Compruebe los datos ingresados');
            }

            const token = jwt.sign( 
                {
                    id_user : user.id_user,
                    role: user.role 
                }, 
                process.env.JWTSECRET, 
                {expiresIn:'48h'} 
            );


            user.password = "";
       
           user = await getRepository(UserModel).findOne(user.id_user, {relations:["address", "orders", "branch"]})
            return responseData(resp, 200, 'Usuario', {user,token});
        } catch (err) {
            console.log(err);
            return responseMessage(resp, 401, false, 'Datos invalidos');
        }

    }

    static renew = async (req:Request, resp:Response):Promise<Response> => {

        const data = await jwt.decode(req.body.token);
        const id = data['id_user'];
        
        const user = await getRepository(UserModel).findOne(id);
        if(!user){
            return responseMessage(resp, 404, false, 'User not found in DB');
        }
        const token = jwt.sign( 
            {
                id_user : user.id_user,
                role: user.role 
            }, 
            process.env.JWTSECRET, 
            {expiresIn:'48h'} 
        );
        return responseData(resp, 200, 'Success', {token});
    }

    static validateAccess = (req:Request,res:Response,next:NextFunction) => {
        try {
            const token = req.header('authorization');
            const payload = jwt.verify(token, process.env.JWTSECRET || '') as IPayload;
            req.body.payload = payload
            next(); 
        } catch  {
            res.status(401).json({message:'Token expired'}); 
        }
    }

}

export default AuthController;
