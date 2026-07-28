import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {

  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "No order items provided" });
  }

  if (!shippingAddress) {
    return res.status(400).json({ success: false, message: "Shipping address is required" });
  }

  const productIds = items.map((i: any) => i.product || i._id || i.id).filter(Boolean);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  const productMap: Record<string, (typeof products)[0]> = {};
  products.forEach((p: any) => {
    productMap[p.id] = p;
  });

  // Stock validation
  for (const item of items) {
    const pId = item.product || item._id || item.id;
    const product = productMap[pId];
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if ((product.stock ?? 0) < item.quantity) {
      return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
    }
  }

  // Build order items
  const orderItems = items.map((i: any) => {
    const pId = i.product || i._id || i.id;
    const dbProduct = productMap[pId];
    if (!dbProduct) {
      throw new Error(`Product ${pId} not found`);
    }
    return {
      product: dbProduct.id,
      name: dbProduct.name,
      image: dbProduct.image,
      price: dbProduct.price,
      quantity: i.quantity || 1,
      unit: dbProduct.unit || "item"
    };
  });

  const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 20 ? 0 : 1.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;


  const order = await prisma.order.create({
    data: {
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      total,
      status: "Placed",
      statusHistory: [
        {
          status: "Placed",
          note: "Order placed successfully",
          timestamp: new Date().toISOString()
        }
      ],
    }
  });

  if (paymentMethod === 'card') {
    // stripe payment link
  }

  for (const items of orderItems) {
    await prisma.product.update({
      where: { id: items.product },
      data: { stock: { decrement: items.quantity } }
    });
  }


}
// get user orders//
export const getUserOrders = async (req: Request, res: Response) => {
  const { status } = req.body;

  const where: any = {
    userId: req.user!.id,
    NOT: [{ paymentMethod: "card", isPaid: false }]
  }
  if (status && status !== "all") {
    where.status = status;

  }
  const orders = await prisma.order.findMany({
    where,
    include: { deliveryPartner: { select: { name: true, phone: true } } },
    orderBy: { createdAt: "desc" }
  })
  res.json(orders);

}

// get single order //
export const getOrder = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
    include: { deliveryPartner: { select: { name: true, phone: true, avatar: true, vehicleType: true } } }
  })
  if (!order) {
    return res.status(404).json({ message: "order not found" })
  }
  res.json({ order })
}

// update order status //
export const updateOrderStatus = async (req: Request, res: Response) => {

  const { status, note } = req.body;
  const order = await prisma.order.findUnique({
    where: { id: req.params.id as string }
  });
  if (!order) {
    return res.status(404).json({ message: "order not found" });
  }
  const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []) as any[];
  history.push({ status, note: note || `Order ${status.toLowerCase()}`, timestamp: new Date().toISOString() });


  const updatedOrder = await prisma.order.update({
    where: { id: req.params.id as string },
    data: {
      status,
      statusHistory: history
    }
  });

  res.json({ order: updatedOrder });
};

// get all orders(admin)//
export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      deliveryPartner: { select: { name: true, phone: true, email: true } }
    },
    orderBy: { createdAt: "desc" },

  });
  res.json({ orders });
};

// get order location//
export const getOrderLocation = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
    select: { liveLocation: true, status: true }
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({ liveLocation: order.liveLocation, status: order.status });
};

