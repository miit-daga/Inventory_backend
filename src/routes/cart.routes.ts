import { Router } from "express";
import { getCartItems, addToCart } from "../controllers/cart.controller";
import verifyAuth from "../middleware/user-auth.middleware";

const router = Router();

router.get("/", verifyAuth, getCartItems);
router.post("/", verifyAuth, addToCart);

export default router;
