import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { responseMessage, responseData } from '../utils/responses';
import { OrdersModel } from '../entity/Orders';
import { generatePymentMethod, generatePaymentIntent } from '../configs/stripe';
import { AddressModel } from '../entity/Address';
import { BranchModel } from '../entity/Branch';
import  Server  from '../configs/server';
import { usuariosConectados } from '../sockets/sockets';
import { UserModel } from '../entity/User';
import { DeliveryManModel } from '../entity/DeliveryMan';
import { AdicionalesModel } from '../entity/ProductosAdicionales';
import { ProductModel } from '../entity/Products';
import { Eventos, Salas } from '../sockets/eventos.enum';
import { CuponesModel } from '../entity/Cupones';

export class OrderController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            const model = await getRepository(OrdersModel).find({relations:["branch", "delivery","user","cupon"]});
            if(model.length == 0) message = 'Empty';
            let result = [];
            for(let i =0; i<model.length; i++){
                let a:orderProduct[] = JSON.parse(JSON.parse(model[i].products)) ?? []
                let prods = await this.getProductsOrders(a)
                let orden:any = model[i]
                orden.products = prods
                result.push(orden)
            }
        
            return responseData(resp, 200, message, result);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Internal Server Error');
        }
    }

    static get_order_user = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            const { user, date } = req.query;
            // const model = await getRepository(OrdersModel).find({where:{branch}, relations:["branch", "delivery"]});
            const model = await getRepository(OrdersModel).createQueryBuilder("order")
                                                          .leftJoinAndSelect('order.branch', 'branch')
                                                          .leftJoinAndSelect('order.delivery', 'delivery')
                                                          .leftJoinAndSelect('order.address', 'address')
                                                          .where("order.user = :user", {user:user})
                                                          .andWhere("order.date = :date", {date:date})
                                                          .getMany()
                                                          let result = [];
                                                          for(let i =0; i<model.length; i++){
                                                              let a:orderProduct[] = JSON.parse(JSON.parse(model[i].products))
                                                              let prods = await this.getProductsOrders(a)
                                                              let orden:any = model[i]
                                                              orden.products = prods
                                                              result.push(orden)
                                                          }
            if(model.length == 0) message = 'Empty';
            return responseData(resp, 200, message, model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Internal Server Error');
        }
    }

    static get_order_branch = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            const { branch, date } = req.query;

            // const model = await getRepository(OrdersModel).find({where:{branch}, relations:["branch", "delivery"]});
            const model = await getRepository(OrdersModel).createQueryBuilder("order")
                                                          .leftJoinAndSelect('order.branch', 'branch')
                                                          .leftJoinAndSelect('order.delivery', 'delivery')
                                                          .leftJoinAndSelect('order.address', 'address')
                                                          .where("order.branch = :branch", {branch:branch})
                                                          .andWhere("order.date = :date", {date:date})
                                                          .getMany()
                                                          let result = [];
                                                          for(let i =0; i<model.length; i++){
                                                              let a:orderProduct[] = JSON.parse(JSON.parse(model[i].products))
                                                              let prods = await this.getProductsOrders(a)
                                                              let orden:any = model[i]
                                                              orden.products = prods
                                                              result.push(orden)
                                                          }
            if(model.length == 0) message = 'Empty';
            return responseData(resp, 200, message, model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Internal Server Error');
        }
    }

    static get_orden_delivery = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            const { delivery, date } = req.query;

            // const model = await getRepository(OrdersModel).find({where:{delivery} ,relations:["branch", "delivery"]});
            const model = await getRepository(OrdersModel).createQueryBuilder("order")
                                                          .leftJoinAndSelect('order.branch', 'branch')
                                                          .leftJoinAndSelect('order.delivery', 'delivery')
                                                          .leftJoinAndSelect('order.address', 'address')
                                                          .where("order.delivery = :delivery", {delivery:delivery})
                                                          .andWhere("order.date = :date", {date:date})
                                                          .getMany()
                                                          let result = [];
                                                          for(let i =0; i<model.length; i++){
                                                              let a:orderProduct[] = JSON.parse(JSON.parse(model[i].products))
                                                              let prods = await this.getProductsOrders(a)
                                                              let orden:any = model[i]
                                                              orden.products = prods
                                                              result.push(orden)
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
            const date = new Date();
            if(!req.body.user) {  return responseMessage(resp, 400, false, 'User is neccesary');}
            const model = getRepository(OrdersModel).create({
                date:`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                products: req.body.products,
                address: await getRepository(AddressModel).findOne(req.body.address),
                subtotal: req.body.subtotal,
                total: req.body.total,
                comentario_branch: req.body.comentario_branch,
                comentario_deliveryman: req.body.comentario_deliveryman,
                ordena_recoje: req.body.ordena_recoje ? req.body.ordena_recoje : false,
                payment_type: req.body.payment_type,
                pin: req.body.pin,
                delivery: req.body.id_delivery,
                branch: await getRepository(BranchModel).findOne(req.body.address),
                user: await getRepository(UserModel).findOne(req.body.user),
                cupon: await getRepository(CuponesModel).findOne(req.body.cupon)
            });
            const order = await getRepository(OrdersModel).save(model);
            return responseData(resp, 200, 'Created', order);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(OrdersModel).findOne(req.params.id, {relations:["branch", "delivery","user","cupon"]});
            if(!model) return responseMessage(resp, 404, false, 'Not Found');
                let a:orderProduct[] = JSON.parse(JSON.parse(model.products)) ?? []
                let prods = await this.getProductsOrders(a)
                let orden:any = model
                orden.products = prods
            return responseData(resp, 200, 'Datos obtenidos', orden);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let model = await getRepository(OrdersModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            const { is_branch } = req.query;

            if(is_branch == "1"){
                model.delivery = req.body.id_delivery;
                model.accepted = req.body.accepted;
                model.cancelado = req.body.cancelado;
                model.prepared = req.body.prepared;
                model.ready = req.body.ready;
                model.on_way = req.body.on_way;
                model.finalized = req.body.finalized;
            }else{

                let message:string = "Orden";
                let flag:boolean = false;

                if(model.prepared == true){
                    message = 'Order in process';
                    flag = true;
                }

                if(model.ready == true){
                    message = 'your order is ready';
                    flag = true;
                }

                if(model.on_way == true){
                    message = 'your order is on its way';
                    flag = true;
                }

                if(model.finalized == true){
                    message = 'order finished';
                    flag = true;
                }

                if(model.cancelado == true){
                    message = 'Order canceled';
                    flag = true;
                }

                if(flag){
                    return responseMessage(resp, 200, true, message);
                }

                model = Object.assign(model,req.body)
            }

            await getRepository(OrdersModel).update({branch:model.branch},model);
            return responseMessage(resp, 201, true, 'successful update');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static delete = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(OrdersModel).findOne(req.params.id);
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

            await getRepository(OrdersModel).delete(req.params.id);
            return responseMessage(resp, 201, true, 'was successfully deleted');
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }


    static payOrder = async (req:Request, resp:Response) => {
        try {
            const id_order = req.params.id;
            const { token } = req.body;

            const order = await getRepository(OrdersModel).findOne({where:{id_order}});
            console.log(order);
            
            if(!order) return responseMessage(resp, 404, false, 'Order not exist');

            if(order.pagado == true) return responseMessage(resp, 406, true, 'Esta orden ya fue pagada');
       
            const responseMethod = await generatePymentMethod(token);
            
            const responsePaymentIntent = await generatePaymentIntent({
                amount: order.total,
                branch: "Freshco",
                payment_method: responseMethod.id
            });

            return responseData(resp, 200, 'Orden pagada con exito', {pago:responsePaymentIntent,id_order});
        } catch (error) {
            console.log(error);
            return responseMessage(resp, 400, false, 'Error al procesar pago');
        }

        // Bucar una orden del producto en nuestra base de datos
        // const customer = await stripe.customers.create({
        //     email: req.body.stripeEmail,
        //     source: req.body.stripeToken
        // })

        // const charge = await stripe.charges.create({
        //     amount: '3000',
        //     currency: 'MXN',
        //     customer: customer.id,
        // })

        // resp.send(charge);

    }



    static confirmOrder = async(req:Request,res:Response) => {
        try {
            const id_order = req.params.id
            const order = await getRepository(OrdersModel).findOne({where:{id_order}});
        
           
            if(!order) return responseMessage(res, 404, false, 'Order not exist');
            const ordenPagada = getRepository(OrdersModel).merge(order, {
                pagado: true
            })
            const result = await getRepository(OrdersModel).save(ordenPagada);
            const server = Server.instance;

            server.io.in(Salas.ADMIN).emit(Eventos.ADMIN,result);
            return responseData(res, 200, 'Order successfull', {message:'OK'});
        } catch (error) {
            console.log(error);
            
            return responseMessage(res, 400, false, 'Error al confirmar el pago');
        }

    }



   static getProductsOrders = async (Array: orderProduct[]) => {

        let result:any[] = [];
        for(let i =0 ; i < Array.length; i++){
            if(Array[i].isAdicional){
                let idProduct = await getRepository(AdicionalesModel).findOne(Array[i].idProduct)
                 let res = {
                     cantidad:Array[i].cantidad,
                     idProduct,
                     isAdicional:Array[i].isAdicional
                 }
                 result.push( res)
             }else{
                 let idProduct = await getRepository(ProductModel).findOne(Array[i].idProduct)           
                let res = {
                     cantidad:Array[i].cantidad,
                     idProduct,
                     isAdicional:Array[i].isAdicional
                 }
                 result.push(res)
               
             }


        }
    
        
       return  result
    }


   
    
}

export interface orderProduct{
    idProduct:any
    cantidad:number
    isAdicional:boolean
}
