import { Router } from "express";
import {
  signup,
  login,
  addFirebaseData,
  getFirebaseData,
} from "../controllers/client.controller";
import verifyAuth from "../middleware/client-auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/firebase-data", verifyAuth, addFirebaseData);
router.get("/firebase-data", verifyAuth, getFirebaseData);

export default router;
