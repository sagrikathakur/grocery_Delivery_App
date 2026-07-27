import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";

export const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, user not logged in" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const rawAdminEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
    const adminEmails = rawAdminEmails
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (adminEmails.includes(user.email.toLowerCase())) {
      if (req.user) {
        req.user.isAdmin = true;
      }
      return next();
    } else {
      return res.status(403).json({ message: "Access denied, admin authorization required" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: 'Admin verification failed',
      error: error.message
    });
  }
};

export default admin;