import { Router } from "express";
import UserController from "../controllers/UserController";
import ProductController from "../controllers/ProductController";
import OrderController from "../controllers/OrderController";

const router = Router()

router.use('/users',UserController.getRouter())
router.use('/products',ProductController.getRouter())
router.use('/orders',OrderController.getRouter())

export default router;