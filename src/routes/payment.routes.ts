import { Router } from "express";
import {
  getPayments,
  createPayment,
  getPaymentByClientId,
  updatePaymentStatus,
} from "../controllers/payment.controller";
import verifyAuth from "../middleware/user-auth.middleware";
import * as clientVerification from "../middleware/client-auth.middleware";

const router = Router();

router.get("/", verifyAuth, getPayments);
router.post("/", verifyAuth, createPayment);
router.get("/client", clientVerification.default, getPaymentByClientId);
router.patch("/status", clientVerification.default, updatePaymentStatus);

export default router;
