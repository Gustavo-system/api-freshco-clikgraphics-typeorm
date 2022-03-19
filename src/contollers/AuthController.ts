import { Request, Response} from 'express';
import { getRepository } from 'typeorm';
import { responseMessage, responseData } from '../utils/responses';
import * as jwt from 'jsonwebtoken';
import { compareEncrypted } from '../utils/helpers/helpers';
import { UserModel } from '../entity/User';

class AuthController{

    static login = async (req:Request, resp:Response):Promise<Response> => {

        const { email, password, username } = req.body;

        console.log(email, password, username)

        if((email == undefined && password == undefined) && (username == undefined && password == undefined)){
            return responseMessage(resp, 400, false, 'Se requieren credeciales');
        }

        try {

            let user:any = [];
            if( email ){
                console.log('por correo')
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
                    username : user.username,
                    role: user.role 
                }, 
                process.env.JWTSECRET, 
                {expiresIn:'48h'} 
            );

            const saveToken =  getRepository(UserModel).merge(user, {
                token
            });
            await getRepository(UserModel).save(saveToken);

            user.s_password = "";
            return responseData(resp, 200, 'Usuario', user);
        } catch (err) {
            console.log(err);
            return responseMessage(resp, 401, false, 'Datos invalidos');
        }

    }

}

export default AuthController;
