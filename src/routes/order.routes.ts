import { Router } from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  getOrdersByClientId,
  updateOrderReturnReason,
} from "../controllers/order.controller";
import verifyAuth from "../middleware/user-auth.middleware";
import * as clientVerification from "../middleware/client-auth.middleware";
import sufficientProduct from "../middleware/sufficient-product.middleware";

const router = Router();

router.get("/", verifyAuth, getOrders);
router.post("/", verifyAuth, sufficientProduct, createOrder);
router.patch("/status", clientVerification.default, updateOrderStatus);
router.get("/client", clientVerification.default, getOrdersByClientId);
router.patch("/return", verifyAuth, updateOrderReturnReason);

export default router;
