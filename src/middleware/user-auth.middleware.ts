import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";

const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Authorization token required." });
      return;
    }

    const decoded = jwt.decode(token, { complete: true }) as string | jwt.JwtPayload;
    if (typeof decoded === "object" && decoded.payload.user_id) {
      req.user_id = decoded.payload.user_id;
      console.log("User ID:", req.user_id);
    } else {
      res.status(401).json({ message: "Invalid token payload." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user_id },
    });
    if (!user) {
      res.status(401).json({ message: "Invalid token payload." });
      return;
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error during authentication." });
  }
};

export default verifyAuth;
