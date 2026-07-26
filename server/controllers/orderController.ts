import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { items, shippingAddress, paymentMethod, subtotal, deliveryFee, tax, total } = req.body;

    if (!items || !shippingAddress || total === undefined) {
      return res.status(400).json({ success: false, message: "Missing required order fields" });
    }

    const now = new Date().toISOString();
    const order = await prisma.order.create({
      data: {
        userId,
        items,
        shippingAddress,
        paymentMethod: paymentMethod || "card",
        subtotal: subtotal || 0,
        deliveryFee: deliveryFee || 0,
        tax: tax || 0,
        total,
        status: "Placed",
        statusHistory: [{ status: "Placed", time: now }],
        isPaid: paymentMethod !== "cod"
      }
    });

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: id as string },
      include: { user: { select: { name: true, email: true, phone: true } } }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId !== userId && !req.user?.isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/admin/all (Admin)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } }
    });

    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/orders/:id/status (Admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const existingOrder = await prisma.order.findUnique({ where: { id: id as string } });
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const history = Array.isArray(existingOrder.statusHistory)
      ? [...existingOrder.statusHistory, { status, time: new Date().toISOString() }]
      : [{ status, time: new Date().toISOString() }];

    const updatedOrder = await prisma.order.update({
      where: { id: id as string },
      data: {
        status,
        statusHistory: history
      }
    });

    res.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
