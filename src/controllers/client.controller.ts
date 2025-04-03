import { Request, Response } from "express";
import * as clientService from "../services/client.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await clientService.signup(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("reached here");
  try {
    const result = await clientService.login(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const addFirebaseData = async (req: Request, res: Response) => {
    try {
      const clientId  = req.user_id;
      const firebaseData = req.body;
  
      const result = await clientService.addFirebaseData(clientId, firebaseData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

export const getFirebaseData = async (req: Request, res: Response) => {
    const clientId = req.user_id;
    const firebaseData = await clientService.getFirebaseData(clientId);
    console.log(firebaseData);
    res.status(200).json(firebaseData);
};
