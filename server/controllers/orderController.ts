import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

// create order//
export const createOrder = async (req: Request, res: Response) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }
  // look up actual product and price//

  const productIds = items.map((item: any) => item.product);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap: Record<string, (typeof products)[0]> = {};
  products.forEach((p: any) => (productMap[p.id] = p));

  //check if product is in stock /
  for (const item of items) {
    const product = productMap[item.product];
    if (!product || (product.stock ?? 0) < item.quantity) {
      return res.status(400).json({ message: 'product is out of stock' });
    }
  }

  const orderItems = items.map((item: any) => {
    const dbProduct = productMap[item.product];
    if (!dbProduct) throw new Error(`product ${item.product} not found `);
    return {
      product: dbProduct.id,
      name: dbProduct.name,
      image: dbProduct.image,
      price: dbProduct.price,
      quantity: item.quantity,
      unit: dbProduct.unit,
    };
  });

  const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 20 ? 0 : 1.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

  const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryOtp,
      statusHistory: [{ status: "placed", note: "order placed", timestamp: new Date() }]
    }
  });

  // decrement stock//
  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.product },
      data: { stock: { decrement: item.quantity } }
    });
  }

  // trigger inngest event for 5-min delayed auto-assignment of rider
  try {
    await inngest.send({
      name: "order.placed",
      data: { orderId: order.id }
    });
  } catch (err) {
    console.error("Failed to send order.placed event to Inngest:", err);
  }

  return res.status(201).json(order);
};

// get users orders//
export const getUserOrders = async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: any = { userId: req.user!.id, NOT: [{ paymentMethod: "card", isPaid: false }] };
  if (status && status !== "all") {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      deliveryPartner: { select: { name: true, phone: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.status(200).json(orders);
};

// get single order//
export const getOrder = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
    include: { deliveryPartner: { select: { name: true, phone: true, avatar: true, vehicleType: true } } }
  });

  if (!order) {
    return res.status(404).json({ message: "order not found" });
  }
  return res.status(200).json(order);
};

// update order status//
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status, note } = req.body;
  const order = await prisma.order.findUnique({
    where: { id: req.params.id as string }
  });

  if (!order) {
    return res.status(404).json({ message: "order not found" });
  }

  const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []) as any[];
  history.push({
    status,
    note: note || `order ${status.toLowerCase()}`,
    timestamp: new Date()
  });

  const updatedOrder = await prisma.order.update({
    where: { id: req.params.id as string },
    data: {
      status,
      statusHistory: history
    }
  });

  return res.status(200).json(updatedOrder);
};

// get all orders for admin//
export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
    include: {
      user: { select: { name: true, email: true } },
      deliveryPartner: { select: { name: true, phone: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return res.status(200).json(orders);
};

// get order location//
export const getOrderLocation = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
    select: { liveLocation: true, status: true }
  });
  if (!order) {
    return res.status(404).json({ message: "order not found" });
  }
  return res.status(200).json({ liveLocation: order.liveLocation, status: order.status });
};