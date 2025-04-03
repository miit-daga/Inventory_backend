import { Router } from "express";
import { getReviews, createReview } from "../controllers/review.controller";
import verifyAuth from "../middleware/user-auth.middleware";

const router = Router();

router.get("/", verifyAuth, getReviews);
router.post("/", verifyAuth, createReview);

export default router;
