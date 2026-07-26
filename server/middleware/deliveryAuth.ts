import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const deliveryAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : (req.headers.token as string);

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, token missing" });
    }

    const secret = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(token, secret) as { id: string; role?: string };

    (req as any).partnerId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
  }
};

export default deliveryAuth;
