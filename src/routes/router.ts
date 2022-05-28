import { Router } from "express";
import { UserController } from '../contollers/UsersController';
import { BranchController } from '../contollers/BranchController';
import { ProductsController } from '../contollers/ProductsController';
import { CategoriesController } from '../contollers/CategoriesController';

import { DeliveryManController } from '../contollers/DeliveryManController';
import { OrderController } from '../contollers/OrderController';
import { AddressController } from '../contollers/AddressController';
import { DeliveryMan } from "../configs/libs/multer/ImagenesMulter";

import AuthController from "../contollers/AuthController";
import upload from "../configs/libs/multer/multer";
// import multer from "../configs/libs/multer/multer";
import { AdicionalesController } from '../contollers/AdicionalesController';
import { CuponesController } from "../contollers/CuponesController";
import { TamanoController } from '../contollers/TamanoController';

const router = Router();

router.post('/auth/login' ,AuthController.login);
router.post('/auth/renew',AuthController.renew)
/**
 * tablas catalogo
 */
router.get('/categories',AuthController.validateAccess, CategoriesController.get);
router.post('/categories', CategoriesController.post);
router.get('/categories/:id', CategoriesController.getID);
router.put('/categories/:id', CategoriesController.update);
router.delete('/categories/:id', CategoriesController.delete);
router.delete('/categories/disabled/:id', CategoriesController.disabled);

router.get('/address', AddressController.get);
router.post('/address', AddressController.post);
router.get('/address/:id', AddressController.getID);
router.put('/address/:id', AddressController.update);
router.delete('/address/:id', AddressController.delete);

/**
 * tablas trabajo
 */
router.get('/users', UserController.get);
router.post('/users', upload.single('image'), UserController.post);
router.get('/users/:id', UserController.getID);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);
router.delete('/users/disabled/:id', UserController.disabled);
router.put('/users/password/:id', UserController.changePassword);

router.get('/branchs', BranchController.get);
router.post('/branchs', upload.single('image'), BranchController.post);
router.get('/branchs/:id', BranchController.getID);
router.put('/branchs/:id', BranchController.update);
router.delete('/branchs/:id', BranchController.delete);

router.get('/productos_adicionales', AdicionalesController.get);
router.post('/productos_adicionales', AdicionalesController.post);
router.get('/productos_adicionales/:id', AdicionalesController.getID);
router.put('/productos_adicionales/:id', AdicionalesController.update);
router.delete('/productos_adicionales/:id', AdicionalesController.delete);

router.delete('/productos_adicionales/disabled/:id', AdicionalesController.disabled);

router.get('/products', ProductsController.get);
router.post('/products', upload.single('image'), ProductsController.post); 
router.get('/products/:id', ProductsController.getID);
router.put('/products/:id',upload.single('image'),ProductsController.update);
router.delete('/products/:id', ProductsController.delete);
router.delete('/products/disabled/:id', ProductsController.disabled);

router.get('/delivery_man', DeliveryManController.get);
router.post('/delivery_man', DeliveryMan, DeliveryManController.post);
router.get('/delivery_man/:id', DeliveryManController.getID);
router.put('/delivery_man/:id', DeliveryMan, DeliveryManController.update);
router.delete('/delivery_man/:id', DeliveryManController.delete);

router.get('/orders', OrderController.get);
router.get('/orders_user', OrderController.get_order_user);
router.get('/orders_branch/:branch', OrderController.get_order_branch);
router.get('/orders_delivery', OrderController.get_orden_delivery);

router.post('/orders', OrderController.post);
router.get('/orders/:id', OrderController.getID);
router.put('/orders/:id', OrderController.update);/* 
router.put('/orders/cancel_order_customer/:id', OrderController.cancelOrderCustomer); */
router.put('/orders/confirm_order_efectivo/:id', OrderController.confirmOrderEfectivo);

router.put('/orders/confirm/:id', OrderController.confirmOrder);
router.delete('/orders/:id', OrderController.delete);

router.post('/coupons', CuponesController.create);
router.get('/coupons/', CuponesController.get);
router.put('/coupons/:id', CuponesController.update);
router.get('/coupons/:name/:idUser', CuponesController.getName);
router.delete('/coupons/:id', CuponesController.desactive);

router.post('/tamano', TamanoController.create);
router.get('/tamano', TamanoController.getAll);
router.put('/tamano/:id', TamanoController.update);
router.delete('/tamano/:id', TamanoController.delete);

/**
 * Ruta para realizar pagos
 */
router.post('/pay_order/:id', OrderController.payOrder)

export default router;