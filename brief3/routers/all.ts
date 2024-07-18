import { Router } from "express";
import UserController from "../controllers/UserController";
import ProductController from "../controllers/ProductController";
import OrderController from "../controllers/OrderController";
import authRouter from "./authRouter";
import TestController from "../controllers/TestController";

const router = Router()

router.use('/auth',authRouter)
router.use('/users',UserController.getRouter())
router.use('/products',ProductController.getRouter())
router.use('/orders',OrderController.getRouter())
router.use('/test',TestController.getRouter())

export default router;