import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// POST /api/delivery/login - Login for delivery partner
export const deliveryLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const partner = await prisma.deliveryPartner.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!partner) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (!partner.isActive) {
      return res.status(403).json({ success: false, message: "Account is deactivated. Contact admin." });
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: partner.id, role: "delivery" },
      (process.env.JWT_SECRET || "default_secret") as string,
      { expiresIn: "30d" }
    );

    const partnerData: any = { ...partner };
    delete partnerData.password;

    res.json({ success: true, token, partner: partnerData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/delivery/orders - Get orders assigned to logged in delivery partner
export const getAssignedOrders = async (req: Request, res: Response) => {
  try {
    const partnerId = (req as any).partnerId || (req as any).user?.id;
    if (!partnerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await prisma.order.findMany({
      where: { deliveryPartnerId: partnerId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, phone: true } } }
    });

    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/delivery/order-status - Update order status by delivery partner
export const updateDeliveryOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, status, otp } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId as string } });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // If status is Delivered, verify OTP if set
    if (status === "Delivered" && order.deliveryOtp) {
      if (order.deliveryOtp !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP code" });
      }
    }

    const history = Array.isArray(order.statusHistory)
      ? [...(order.statusHistory as any[]), { status, time: new Date().toISOString() }]
      : [{ status, time: new Date().toISOString() }];

    const updated = await prisma.order.update({
      where: { id: orderId as string },
      data: {
        status,
        statusHistory: history as any,
        isPaid: status === "Delivered" ? true : order.isPaid
      }
    });

    res.json({ success: true, order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/delivery/location - Update live location for an order
export const updateOrderLocation = async (req: Request, res: Response) => {
  try {
    const { orderId, lat, lng } = req.body;

    if (!orderId || lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: "Order ID and coordinates are required" });
    }

    const updated = await prisma.order.update({
      where: { id: orderId as string },
      data: {
        liveLocation: { lat: Number(lat), lng: Number(lng), updatedAt: new Date().toISOString() } as any
      }
    });

    res.json({ success: true, liveLocation: updated.liveLocation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/delivery/profile - Get profile of delivery partner
export const getPartnerProfile = async (req: Request, res: Response) => {
  try {
    const partnerId = (req as any).partnerId || (req as any).user?.id;
    if (!partnerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const partner = await prisma.deliveryPartner.findUnique({
      where: { id: partnerId as string }
    });

    if (!partner) {
      return res.status(404).json({ success: false, message: "Delivery partner not found" });
    }

    const partnerData: any = { ...partner };
    delete partnerData.password;

    res.json({ success: true, partner: partnerData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
