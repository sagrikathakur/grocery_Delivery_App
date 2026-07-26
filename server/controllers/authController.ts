import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getAdminStatus } from "../middleware/auth.js";

// Helper to generate JWT Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, (process.env.JWT_SECRET || "default_secret") as string, {
    expiresIn: "30d",
  });
};

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields (name, email, password) are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), password: hashedPassword }
    });

    const token = generateToken(user.id);

    const userData: any = { ...user };
    delete userData.password;
    userData.isAdmin = getAdminStatus(user.email);

    return res.status(201).json({
      success: true,
      token,
      user: userData
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    const userData: any = { ...user };
    delete userData.password;
    userData.isAdmin = getAdminStatus(user.email);

    return res.status(200).json({
      success: true,
      token,
      user: userData
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me - Get current logged-in user profile
export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};