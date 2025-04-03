import { Request, Response } from "express";
import reviewService from "../services/review.service";

export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getReviews(req.user_id);
    res.status(200).json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const review = await reviewService.createReview({
      ...req.body,
      userId: req.user_id,
    });
    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
