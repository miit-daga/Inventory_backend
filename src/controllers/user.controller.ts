import { Request, Response } from "express";
import * as userService from "../services/user.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await userService.signup(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const getClientUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsersOfClient(req.user_id);
    res.status(200).json({ result: result });
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
};
