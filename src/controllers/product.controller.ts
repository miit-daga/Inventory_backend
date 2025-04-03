import { Request, Response } from "express";
import productService from "../services/product.service";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const clientId = req.user_id;
    const body = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      clientId,
      description: req.body.description,
      categoryId: req.body.categoryId,
      images: req.body.images,
    };
    const product = await productService.createProduct(body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const clientId = req.user_id;
    const products = await productService.getProductByClientId(clientId);
    res.status(201).json(products);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
