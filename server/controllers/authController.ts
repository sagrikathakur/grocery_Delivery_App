// register

import { Request, Response } from "express";
import { prisma } from "../config/prisma.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

// jwt//
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  )
}

// check user is admin

const getAdminStatus = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase()) : [];
  return adminEmails.includes(email.trim().toLowerCase())
}








// POST/ api /auth / register


export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "all fields are required" })
  }
  const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists with the email' })
  }

  // password hashing 

  const hashedPassword = await bcrypt.hash(password, 10);

  // creating a database//

  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), password: hashedPassword }
  });

  const token = generateToken(user.id)

  // send response

  const userData: any = { ...user }
  delete userData.password;
  userData.isAdmin = getAdminStatus(user.email);

  res.status(201).json({
    success: true,
    token,
    user: userData
  })
}

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