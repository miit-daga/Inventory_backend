import * as ProductService from "../services/product.service";
import { NextFunction, Response, Request } from "express";

export default async function sufficientProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderItems } = req.body;
    const insufficientProducts = [];

    for (const orderItem of orderItems) {
      const isAvailable = await ProductService.default.isProductAvailable(
        orderItem.productId,
        orderItem.quantity
      );

      if (!isAvailable) {
        insufficientProducts.push(orderItem.productId);
      }
    }

    if (insufficientProducts.length > 0) {
      res.status(400).json({
        message: "Insufficient stock for the following products.",
        insufficientProducts,
      });
      return;
    }

    next();
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to verify product stock.",
      error: error.message,
    });
  }
}