import { Request, Response, NextFunction } from "express";
import { getAdminStatus } from "./auth.js";

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, user not authenticated"
    });
  }

  const isAdmin = req.user.isAdmin ?? getAdminStatus(req.user.email);

  if (isAdmin) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin authorization required."
    });
  }
};

export const requireAdmin = admin;
export default admin;
