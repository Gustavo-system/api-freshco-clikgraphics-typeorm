import { Request, Response } from "express"
import { getRepository } from "typeorm";
import { CuponesModel } from "../entity/Cupones";
import { OrdersModel } from "../entity/Orders";
import { ProductModel } from "../entity/Products";
import { UserModel } from "../entity/User";
import { responseData, responseMessage } from "../utils/responses";
import { BranchModel } from '../entity/Branch';



export class CuponesController{

    static get = async (req:Request,res:Response) => {

        try {
            let date = new Date() 
            let dat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            let cupones:CuponesModel[] = []
            let message ="OK"     
            const { id_branch } = req.query;
           
            if(id_branch){
 
                cupones = await getRepository(CuponesModel).find({relations:["products","branch"]});
                
              //  cupones = cupones.filter( c => c.branch.id_branch === Number(id_branch) ?? [])
                
            }else{
                cupones = await getRepository(CuponesModel).find({relations:["products","branch"]});
            }
            if(cupones.length == 0) {
                return responseData(res, 200, message, []);
            }
             cupones = cupones.filter( m => m.active === true || new Date(m.date).getTime()  > new Date(dat).getTime() )
             return responseData(res, 200, message, cupones);
        } catch (error) {
            console.log(error);
            
            return responseMessage(res, 500, false, 'Internal Server Error');
        }

    }
    static create = async (req:Request,res:Response) => {
        try {
            let {date,description,name,products ,allProducts,discount,percentage,branch,initialDate} = req.body
            let result = []
            if(!products) { return responseMessage(res, 400, false, 'Not products in the coupon')}
            if(products.length > 0){
                for(let i= 0 ; i <products.length; i++ ){
                    const product = await getRepository(ProductModel).findOne({where:{id_product :products[i]}})
                    if(product) 
                    result.push(product)
                }
                products = result
            }

            const model = getRepository(CuponesModel).create({
                date,
                description,
                name,
                products,
                initialDate,
                allProducts,
                discount,
                percentage,
                branch : await getRepository(BranchModel).findOne(branch)
            })
            console.log(model);
            
            let coupon= await getRepository(CuponesModel).save(model)
            return responseData(res, 200, 'Created', coupon);
            
        } catch (error) {
            console.log(error);
            if(error.code ==='ER_DUP_ENTRY'){
                return responseMessage(res, 400, false, 'name was used');
            }
            return responseMessage(res, 500, false, 'Internal Server Error');
        }

    }
    static getId = async (req:Request,res:Response) => {
        try {
            let message ="OK"
            let cupon =  await getRepository(CuponesModel).findOne(req.params.id,{relations:["products","branch"]})
            if(!cupon) message = "not Found"
            return responseData(res, 200, message, cupon);
        } catch (error) {
            if(error.code ="ER_DUP_ENTRY"){
                return responseMessage(res, 400, false, 'name coupon was used');
            }
            return responseMessage(res, 500, false, 'Internal Server Error');
        }
    }

    static getName = async (req:Request,res:Response) => {
        try {
            let message ="OK"
            let name = req.params.name.toLowerCase().replace(/ /g, "")
            let user = await getRepository(UserModel).findOne(req.params.idUser, {relations:["orders"]});
            let cupon =  await getRepository(CuponesModel).findOne({name},{relations:["products"],where:{active:true}}) 
            let count =0;
            
            if(!user){   return responseMessage(res, 404, false, 'User not found');}
            if(!cupon) {return responseMessage(res, 404, false, 'Coupon not found'); }
            user.orders = await this.getOrders(user.orders);
            if(user.orders.length < 0){
                return responseData(res, 200, message, cupon);
            }
            for(let i =0 ; i<user.orders.length; i++){
                if(  user.orders[i].cupon?.id_coupon === cupon.id_coupon){
                    count++;
                }
            }
            if(count >= cupon.uses){
                return responseMessage(res, 406, false, 'You have used the coupon up to the allowed limit');
            }
            if(!cupon) message = "not Found"
            return responseData(res, 200, message, cupon);
        } catch (error) {
            console.log(error);
            
            return responseMessage(res, 500, false, 'Internal Server Error');
        }
    }
    static desactive = async (req:Request,res:Response) => {
        try {
            let message ="OK"
            let cupon = await getRepository(CuponesModel).findOne(req.params.id)
            cupon.products = []
            cupon.branch=null;
          await getRepository(CuponesModel).save(cupon)
           
         await getRepository(CuponesModel).delete(req.params.id)
        
            return responseData(res, 200, message, true);
        } catch (error) {
            console.log(error);
            
            return responseMessage(res, 500, false, 'Internal Server Error');
        }

    }
    static update = async (req:Request,res:Response) => {
        try {
            let result = []
            let cupon = await getRepository(CuponesModel).findOne(req.params.id)
            if(!cupon)   return responseData(res, 404, "Not Found", cupon);
            if(req.body.products && req.body.products.length > 0){
                for(let i= 0 ; i <req.body.products.length; i++ ){
                    const product = await getRepository(ProductModel).findOne({where:{id_product :req.body.products[i]}})
                    if(product) 
                    result.push(product)
                }
                req.body.products = result
            }
            if(req.body.branch){
                req.body.branch = await getRepository(BranchModel).findOne(req.body.branch)
            }
            const model = Object.assign(cupon,req.body)

            let coupon= await getRepository(CuponesModel).save(model)
            return responseData(res, 200, 'Updated', coupon);
        } catch (error) {
            console.log(error);
            
            return responseMessage(res, 500, false, 'Internal Server Error');
        }

    }


    static getOrders = async ( Array:any[]) => {
        let result = []
        for(let i=0 ; i< Array.length; i++){
            let Order = await getRepository(OrdersModel).findOne(Array[i].id_order,{relations:["cupon"]})
            if(Order) result.push(Order)
        }
        return result
    }   
}