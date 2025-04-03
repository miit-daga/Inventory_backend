import { Request, Response } from "express";
import orderService from "../services/order.service";
import prisma from "../config/prisma";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders(req.user_id);
    res.status(200).json(orders);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders.", error: error.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.createOrder({
      userId: req.user_id,
      status: "pending",
      orderItems: req.body.orderItems,
    });
    res.status(201).json({ message: "Order created successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to create order.", error: error.message });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId, status } = req.body;
    const validStatuses = [
      "pending",
      "packed",
      "shipped",
      "delivered",
      "cancel",
      "return",
      "replacement",
    ];

    if (!orderId || !status) {
      res
        .status(400)
        .json({ message: "Missing required fields: orderId, status" });
      return;
    }

    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status provided." });
      return;
    }

    const updatedOrder = await orderService.updateOrderStatus(orderId, status);

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update order status.",
      error: error.message,
    });
  }
};

export const getOrdersByClientId = async (req: Request, res: Response) => {
  try {
    const clientId = req.user_id;
    const orders = await orderService.getOrdersByClientId(clientId);

    const orderObj = orders.map((order: any) => {
      return {
        orderId: order.id,
        total: order.totalAmount/100,
        status: order.status,
        payment: order.payment ? "Paid" : "COD",
        createdAt: order.createdAt,
        userName: order.user.name,
        returnReason: order.returnReason,
      };
    });
    res.status(200).json({ orders: orderObj });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders.", error: error.message });
  }
};

export const updateOrderReturnReason = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId, returnReason } = req.body;

    if (!orderId || !returnReason) {
      res
        .status(400)
        .json({ message: "Missing required fields: orderId, returnReason" });
      return;
    }

    const updatedOrder = await orderService.updateOrderReturnReason(
      orderId,
      returnReason
    );

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update order return reason.",
      error: error.message,
    });
  }
}
