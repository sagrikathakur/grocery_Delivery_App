import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

// GET /api/admin/stats - Overview statistics
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count();
    const totalPartners = await prisma.deliveryPartner.count();

    const orders = await prisma.order.findMany({
      select: { total: true }
    });
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalPartners,
        totalRevenue
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/partners - Get all delivery partners
export const getDeliveryPartners = async (req: Request, res: Response) => {
  try {
    const partners = await prisma.deliveryPartner.findMany({
      orderBy: { createdAt: "desc" }
    });

    const sanitized = partners.map((p) => {
      const copy: any = { ...p };
      delete copy.password;
      return copy;
    });

    res.json({ success: true, partners: sanitized });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/partners - Register a new rider/delivery partner
export const addDeliveryPartner = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, vehicleType } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "Name, email, and phone are required" });
    }

    const existing = await prisma.deliveryPartner.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Delivery partner with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    const partner = await prisma.deliveryPartner.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        vehicleType: vehicleType || "bike",
        isActive: true
      }
    });

    const partnerData: any = { ...partner };
    delete partnerData.password;

    res.status(201).json({ success: true, partner: partnerData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/partners/:id/status - Toggle active/inactive status
export const togglePartnerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const partner = await prisma.deliveryPartner.findUnique({ where: { id: id as string } });
    if (!partner) {
      return res.status(404).json({ success: false, message: "Delivery partner not found" });
    }

    const updated = await prisma.deliveryPartner.update({
      where: { id: id as string },
      data: { isActive: !partner.isActive }
    });

    const partnerData: any = { ...updated };
    delete partnerData.password;

    res.json({ success: true, partner: partnerData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/orders/:id/assign - Assign delivery partner to order
export const assignOrderPartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { partnerId } = req.body;

    const order = await prisma.order.findUnique({ where: { id: id as string } });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const partner = await prisma.deliveryPartner.findUnique({ where: { id: partnerId as string } });
    if (!partner) {
      return res.status(404).json({ success: false, message: "Delivery partner not found" });
    }

    const deliveryOtp = order.deliveryOtp || Math.floor(100000 + Math.random() * 900000).toString();

    const history = Array.isArray(order.statusHistory)
      ? [...(order.statusHistory as any[]), { status: "Out for Delivery", note: `Assigned to ${partner.name}`, time: new Date().toISOString() }]
      : [{ status: "Out for Delivery", note: `Assigned to ${partner.name}`, time: new Date().toISOString() }];

    const updated = await prisma.order.update({
      where: { id: id as string },
      data: {
        deliveryPartnerId: partnerId,
        status: "Out for Delivery",
        deliveryOtp,
        statusHistory: history as any
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        deliveryPartner: { select: { id: true, name: true, email: true, phone: true, vehicleType: true } }
      }
    });

    res.json({ success: true, order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/users - Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        createdAt: true
      }
    });

    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
