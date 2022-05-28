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
            let model;
            if(Number(req.params.id)){
                 model = await getRepository(OrdersModel).find({relations:["branch", "delivery","user","cupon"]});
                 model = model.filter( m => m.branch?.id_branch === req.params.id)
            }else{
                 model = await getRepository(OrdersModel).find({relations:["branch", "delivery","user","cupon"]});
            }

            if(model.length == 0) message = 'Empty';
            let result = [];
            for(let i =0; i<model.length; i++){
                let a:orderProduct[] = JSON.parse(JSON.parse(model[i].products))
                let prods = await this.getProductsOrders(a)
                let orden:any = model[i]
                orden.products = prods
                result.push(orden)
            }
            model = model.filter( m => m.active === true)
            return responseData(resp, 200, message, {orders:result});
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
            const { branch } = req.params;

            // const model = await getRepository(OrdersModel).find({where:{branch}, relations:["branch", "delivery"]});
            let model = await getRepository(OrdersModel).find({relations:["branch", "delivery","user","cupon"]});
       
            model = model.filter( (o:OrdersModel) => o.branch.id_branch === Number(branch))
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
                branch: await getRepository(BranchModel).findOne(req.body.branch),
                user: await getRepository(UserModel).findOne(req.body.user),
                cupon: await getRepository(CuponesModel).findOne(req.body.cupon)
            });
            
            let a:orderProduct[] = JSON.parse(JSON.parse(req.body.products)) ?? []
            let prods = await this.getProductsOrders(a)

            for(let i = 0 ; i<prods.length;i++){
                if(prods[i].isAdicional){
                   let product = await getRepository(AdicionalesModel).findOne(prods[i].idProduct.id_product)
                   product.sold += Number(prods[i].cantidad)
                   await getRepository(AdicionalesModel).update(prods[i].idProduct.id_product,product)
                }else{
                    let product = await getRepository(ProductModel).findOne(prods[i].idProduct.id_product)
                    product.sold += Number(prods[i].cantidad);
                    await getRepository(ProductModel).update(prods[i].idProduct.id_product,product)
                }
       
            }

            let User:any = await getRepository(UserModel).findOne(req.body.user)
            User.wallet -= req.body.moneyUsed ?? 0;
            await getRepository(UserModel).update(User.id_user,User) 
            let order = await getRepository(OrdersModel).save(model);   
            let ord:any = order
            ord.products = prods;

            if(order.payment_type =="Efectivo"){
                let emits = usuariosConectados.findAdminsByBranch(order.branch.id_branch);
                const server = Server.instance;
                if(emits.length > 0)  {
                    for( let i=0;i<emits.length; i++){
                        server.io.in(emits[i].wsId).emit(Eventos.ADMIN,ord);
                    }
                }
            }
            return responseData(resp, 200, 'Created', {order:ord});
        } catch (error) {
            console.log(error)
            return responseMessage(resp, 500, false, 'Bad Request');
        }
    }

    static getID = async (req:Request, resp:Response):Promise<Response> => {
        try {
            const model = await getRepository(OrdersModel).findOne(req.params.id, {relations:["branch", "delivery","user","cupon"]});
            if(!model) return responseMessage(resp, 404, false, 'Not Found');
                let a:orderProduct[] = JSON.parse(JSON.parse(model.products)) ??  []
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
            let model = await getRepository(OrdersModel).findOne(req.params.id,{relations:["branch", "delivery","user","cupon"]});
            if(!model) return responseMessage(resp, 404, false, 'Not Found')

                let message:string = "Orden";
                if(req.body.delivery){
                    model.delivery_assigned = true
                    model.delivery = await getRepository(DeliveryManModel).findOne(req.body.delivery,{relations:["address", "orders", "branch"]})
                    delete req.body.delivery
                }
                if(req.body.accepted == true){
                    message = 'Order in Accepted';
                }
       
                if(req.body.prepared == true){
                    message = 'Order in process';
                }

                if(req.body.ready == true){

                    message = 'your order is ready';
                    
                }

                if(req.body.on_way == true){
                    message = 'your order is on its way';
                }

                if(req.body.finalized == true){
                    if(model.finalized){ return responseMessage(resp, 406, false, 'Orden ya Finalizada');}
                    message = 'order finished';
                }

                if(req.body.cancelado == true){
                    if(model.cancelado){ return responseMessage(resp, 406, false, 'Orden ya cancelada');}
                    message = 'Order canceled';
                    let User:any = await getRepository(UserModel).findOne(model.user.id_user,{relations:["address", "orders", "branch"]})
                    let devolucion:number = Math.floor(Number(((model.total/15) *0.5).toFixed(2)));
                     User.wallet = User.wallet - devolucion + model.moneyUsed;
                     await getRepository(UserModel).save(User)
                     model.user = User
                }
  
                model = Object.assign(model,req.body)
           
                await getRepository(OrdersModel).update(model.id_order,model);
                let a:orderProduct[] = JSON.parse(JSON.parse(model.products)) ??  []
                let prods = await this.getProductsOrders(a)
                let orden:any = model
                orden.products = prods
                const server = Server.instance;
              
                let User = await getRepository(UserModel).findOne(model.user.id_user,{relations:["address", "orders", "branch"]});
                let result = []
            for(let j =0; j<User.orders.length; j++){
                let a:orderProduct[] = JSON.parse(JSON.parse(User.orders[j].products)) ?? []
                let prods = await this.getProductsOrders(a)
                let orden:any = User.orders[j]
                orden.products = prods
               
                result.push(orden)
            }
            User.orders = result;
            orden.user = User;
            let user = usuariosConectados.getUser(model.user.id_user)
            if(user){
                server.io.in(user.wsId).emit(Eventos.CUSTOMER,orden);
            }
                return responseData(resp, 200, message,orden);
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
            const { token } = req.body;
            
            const order = await getRepository(OrdersModel).findOne({where:{id_order:req.params.id},relations:["branch", "delivery","user","cupon","address"]});
            if(!order) return responseMessage(resp, 404, false, 'Order not exist');
            if(!order.branch.online) return responseMessage(resp, 404, false, 'Branch not exist');
            if(order.total === 0){
                this.confirmOrder(req,resp);
                return
            }
            if(order.payment_type == "Wallet" && order.total === 0 ){
                this.confirmOrder(req,resp);
                return
            }
            
            if(order.pagado == true) return responseMessage(resp, 406, true, 'The order was already paid');
        
            const responseMethod = await generatePymentMethod(token);
            
            const responsePaymentIntent = await generatePaymentIntent({
                amount: order.total,
                branch: "Freshco",
                payment_method: responseMethod.id
            });
         
            return responseData(resp, 200, 'Orden pagada con exito', {pago:responsePaymentIntent,id_order:req.params.id});
        } catch (error) {
            console.log(error);
            return responseMessage(resp, 400, false, 'Error al procesar pago');
        }
    }



    static confirmOrder = async(req:Request,res:Response) => {
        try {
            const id_order = req.params.id
            const order = await getRepository(OrdersModel).findOne({where:{id_order},relations:["branch", "delivery","user","cupon","address"]});
            if(!order) return responseMessage(res, 404, false, 'Order not exist');
           if(order.pagado) return responseMessage(res, 406, false, ' The order was already paid');
           let user = await getRepository(UserModel).findOne(order.user.id_user)
           if(order.payment_type === 'Efectivo'){
               return responseData(res, 200, 'Order successfull', {message:'OK',user,order:order});
           }
            
            const ordenPagada = getRepository(OrdersModel).merge(order, {
                pagado: true
            })
            const result = await getRepository(OrdersModel).save(ordenPagada);
        
            user.wallet += Math.floor((order.total/15) * 0.5);
            user.wallet = Number(user.wallet.toFixed(2));
            await getRepository(UserModel).update(user.id_user,user);
             user = await getRepository(UserModel).findOne({where:{id_user:order.user.id_user} ,relations:["address", "orders", "branch"]})
             delete user.token
             delete user.password
             let result2 = [];
             for(let i =0; i<user.orders.length; i++){
                 let a:orderProduct[] = JSON.parse(JSON.parse(user.orders[i].products))
                 let prods = await this.getProductsOrders(a)
                 let orden:any = user.orders[i]
                 orden.products = prods
                 result2.push(orden)
             }
             user.orders = result2
            let a:orderProduct[] = JSON.parse(JSON.parse(order.products))
            let prods = await this.getProductsOrders(a)
            let nOrder:any = result;
            nOrder.products = prods;
            const server = Server.instance;
            let emits = usuariosConectados.findAdminsByBranch(order.branch.id_branch);
            if(emits.length > 0)  {
                for( let i=0;i<emits.length; i++){
                    server.io.in(emits[i].wsId).emit(Eventos.ADMIN,nOrder);
                }
            }
       
            return responseData(res, 200, 'Order successfull', {message:'OK',user,order:nOrder});
        } catch (error) {
            console.log(error);
            
            return responseMessage(res, 400, false, 'Error al confirmar el pago');
        }

    }

    static confirmOrderEfectivo = async(req:Request,res:Response) => {
        try {
            const id_order = req.params.id
            const order = await getRepository(OrdersModel).findOne({where:{id_order},relations:["branch", "delivery","user","cupon","address"]});
            if(!order) return responseMessage(res, 404, false, 'Order not exist');
           if(order.pagado) return responseMessage(res, 406, false, ' The order was already paid');
           let user = await getRepository(UserModel).findOne(order.user.id_user)
                 
            const ordenPagada = getRepository(OrdersModel).merge(order, {
                pagado: true,
                finalized:true
            })
            const result = await getRepository(OrdersModel).save(ordenPagada);
        
            user.wallet += Math.floor((order.total/15) * 0.5);
            user.wallet = Number(user.wallet.toFixed(2));
            await getRepository(UserModel).update(user.id_user,user);
             user = await getRepository(UserModel).findOne({where:{id_user:order.user.id_user} ,relations:["address", "orders", "branch"]})
             delete user.token
             delete user.password
             let result2 = [];
             for(let i =0; i<user.orders.length; i++){
                 let a:orderProduct[] = JSON.parse(JSON.parse(user.orders[i].products))
                 let prods = await this.getProductsOrders(a)
                 let orden:any = user.orders[i]
                 orden.products = prods
                 result2.push(orden)
             }
             user.orders = result2
            let a:orderProduct[] = JSON.parse(JSON.parse(order.products))
            let prods = await this.getProductsOrders(a)
            let nOrder:any = result;
            nOrder.products = prods;
            const server = Server.instance;
            let emits = usuariosConectados.findAdminsByBranch(order.branch.id_branch);
            let customer = usuariosConectados.getUser(order.user.id_user);
            if(emits.length > 0)  {
                for( let i=0;i<emits.length; i++){
                    server.io.in(emits[i].wsId).emit(Eventos.ADMIN,nOrder);
                }
            }
            if(customer){
                server.io.in(customer.wsId).emit(Eventos.CUSTOMER,nOrder);
            }
         
            return responseData(res, 200, 'Order successfull', {message:'OK',user,order:nOrder});
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


    /* static cancelOrderCustomer = async(req:Request,res:Response) => {

        try {
            const id_order = req.params.id
            const order = await getRepository(OrdersModel).findOne({where:{id_order},relations:["branch", "delivery","user","cupon","address"]});
            if(!order) return responseMessage(res, 404, false, 'Order not exist');
           let user = await getRepository(UserModel).findOne(order.user.id_user)
           let User:any = await getRepository(UserModel).findOne(order.user.id_user,{relations:["address", "orders", "branch"]})
           let devolucion:number = Math.floor(Number(((order.total/15) *0.5).toFixed(2)));
            User.wallet = User.wallet - devolucion + order.moneyUsed;
            await getRepository(UserModel).save(User)
            order.user = User
            order.finalized = true;
         
            const result = await getRepository(OrdersModel).save(ordenPagada);
            user.wallet += Math.floor((order.total/15) * 0.5);
            user.wallet = Number(user.wallet.toFixed(2));
            await getRepository(UserModel).update(user.id_user,user);
             user = await getRepository(UserModel).findOne({where:{id_user:order.user.id_user} ,relations:["address", "orders", "branch"]})
             delete user.token
             delete user.password
             let result2 = [];
             for(let i =0; i<user.orders.length; i++){
                 let a:orderProduct[] = JSON.parse(JSON.parse(user.orders[i].products))
                 let prods = await this.getProductsOrders(a)
                 let orden:any = user.orders[i]
                 orden.products = prods
                 result2.push(orden)
             }
             user.orders = result2
            let a:orderProduct[] = JSON.parse(JSON.parse(order.products))
            let prods = await this.getProductsOrders(a)
            let nOrder:any = result;
            nOrder.products = prods;
            const server = Server.instance;
            let emits = usuariosConectados.findAdminsByBranch(order.branch.id_branch);
            if(emits.length > 0)  {
                for( let i=0;i<emits.length; i++){
                    server.io.in(emits[i].wsId).emit(Eventos.ADMIN,nOrder);
                }
            }
         
            return responseData(res, 200, 'Order successfull', {message:'OK',user,order:nOrder});
        } catch (error) {
            console.log(error);
            
            return responseMessage(res, 400, false, 'Error al confirmar el pago');
        }

    } */



   
    
}

export interface orderProduct{
    idProduct:any
    cantidad:number
    isAdicional:boolean
}
