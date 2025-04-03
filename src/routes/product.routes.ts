import { Router } from "express";
import { getAllProducts, createProduct, getProduct } from "../controllers/product.controller";
import verifyAuth from "../middleware/client-auth.middleware";

const router = Router();

router.get("/", getAllProducts);
router.post("/", verifyAuth, createProduct);
router.get("/client", verifyAuth, getProduct);

export default router;