import { Request, Response } from "express";
import cartService from "../services/cart.service";

export const getCartItems = async (req: Request, res: Response) => {
  try {
    const items = await cartService.getCartItems(req.user_id);
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const item = await cartService.addToCart(
      req.user_id,
      req.body.productId,
      req.body.quantity
    );
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
