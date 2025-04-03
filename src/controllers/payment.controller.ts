import { Request, Response } from "express";
import paymentService from "../services/payment.service";

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await paymentService.getPaymentsByUserId(req.user_id);
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await paymentService.createPayment({
      ...req.body,
    });
    res.status(201).json(payment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentByClientId = async (req: Request, res: Response) => {
  try {
    const clientId = req.user_id;
    const payments = await paymentService.getPaymentByClientId(clientId);
    res.status(200).json({ payments });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const updatePayment = await paymentService.updatePaymentStatus(
      req.body.paymentId,
      req.body.status
    );
    res.status(200).json({ message: "Status updated successfully!" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
