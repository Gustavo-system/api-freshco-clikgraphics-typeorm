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

const router = Router();

router.post('/auth/login', AuthController.login);
/**
 * tablas catalogo
 */
router.get('/categories', CategoriesController.get);
router.post('/categories', CategoriesController.post);
router.get('/categories/:id', CategoriesController.getID);
router.put('/categories/:id', CategoriesController.update);
router.delete('/categories/:id', CategoriesController.delete);

router.get('/address', AddressController.get);
router.post('/address', AddressController.post);
router.get('/address/:id', AddressController.getID);
router.put('/address/:id', AddressController.update);
router.delete('/address/:id', AddressController.delete);

/**
 * tablas trabajo
 */
router.get('/users', UserController.get);
router.post('/users', UserController.post);
router.get('/users/:id', UserController.getID);
router.put('/users/:id', UserController.update);
router.delete('/user/:id', UserController.delete);

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

router.get('/products', ProductsController.get);
router.post('/products', upload.single('image'), ProductsController.post);
router.get('/products/:id', ProductsController.getID);
router.put('/products/:id',upload.single('image'),ProductsController.update);
router.delete('/products/:id', ProductsController.delete);

router.get('/delivery_man', DeliveryManController.get);
router.post('/delivery_man', DeliveryMan, DeliveryManController.post);
router.get('/delivery_man/:id', DeliveryManController.getID);
router.put('/delivery_man/:id', DeliveryMan, DeliveryManController.update);
router.delete('/delivery_man/:id', DeliveryManController.delete);

router.get('/orders', OrderController.get);
router.post('/orders', OrderController.post);
router.get('/orders/:id', OrderController.getID);
router.put('/orders/:id', OrderController.update);
router.delete('/orders/:id', OrderController.delete);

/**
 * Ruta para realizar pagos
 */
router.post('/pay_order/:id', OrderController.payOrder)

export default router;