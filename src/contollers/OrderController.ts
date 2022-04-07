import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { responseMessage, responseData } from '../utils/responses';
import { OrdersModel } from '../entity/Orders';
import { generatePymentMethod, generatePaymentIntent } from '../configs/stripe';

export class OrderController{

    static get = async (req:Request, resp:Response):Promise<Response> => {
        try {
            let message:string = "OK"
            const model = await getRepository(OrdersModel).find({relations:["branch", "delivery"]});
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
            const branch = req.params.id_branch;

            const model = await getRepository(OrdersModel).find({where:{branch}, relations:["branch", "delivery"]});
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
            const delivery = req.params.id_delivery;

            const model = await getRepository(OrdersModel).find({where:{delivery} ,relations:["branch", "delivery"]});
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
            const model = getRepository(OrdersModel).create({
                date:`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                products: req.body.products,
                address: req.body.address,
                subtotal: req.body.subtotal,
                total: req.body.total,
                comentario_branch: req.body.comentario_branch,
                comentario_deliveryman: req.body.comentario_deliveryman,
                ordena_recoje: req.body.ordena_recoje ? req.body.ordena_recoje : false,
                payment_type: req.body.payment_type,
                pin: req.body.pin,
                delivery: req.body.id_delivery,
                branch: req.body.id_branch,
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
            const model = await getRepository(OrdersModel).findOne(req.params.id, {relations:["branch", "delivery"]});
            if(!model) return responseMessage(resp, 404, false, 'Not Found');
            return responseData(resp, 200, 'Datos obtenidos', model);
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 400, false, 'Bad Request');
        }
    }

    static update = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(OrdersModel).findOne(req.params.id);
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

                model.products = req.body.products;
                model.address = req.body.address;
                model.subtotal = req.body.subtotal;
                model.total = req.body.total;
                model.comentario_branch = req.body.comentario_branch;
                model.comentario_deliveryman = req.body.comentario_deliveryman;
                model.ordena_recoje = req.body.ordena_recoje ? req.body.ordena_recoje : false;
                model.payment_type = req.body.payment_type;
                model.cancelado = req.body.cancelado ? req.body.cancelado : false;
                model.finalized = req.body.finalized ? req.body.finalized : false;
                model.pin = req.body.pin;
                model.verified_pin = req.body.pin;
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
            console.log(req.body);
            const id_order = req.params.id;
            const { token } = req.body;

            const order = await getRepository(OrdersModel).findOne({where:{id_order}});

            if(!order) return responseMessage(resp, 404, false, 'Order not exist');

            if(order.pagado == true) return responseMessage(resp, 406, true, 'Esta orden ya fue pagada');

            const responseMethod = await generatePymentMethod(token);

            const responsePaymentIntent = await generatePaymentIntent({
                amount: order.total,
                branch: order.branch.name,
                payment_method: responseMethod.id
            });

            const ordenPagada = getRepository(OrdersModel).merge(order, {
                pagado: true
            })
            await getRepository(OrdersModel).save(ordenPagada);

            return responseData(resp, 200, 'Orden pagada con exito', responsePaymentIntent);
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

}