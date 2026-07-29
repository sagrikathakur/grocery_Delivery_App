import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
// create order//

export const createOrder = async (req: Request, res: Response) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" })
  }
  // look up actual product and price//

  const productIds = items.map((item: any) => item.product);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
  const productMap: Record<string, (typeof products)[0]> = {}
  products.forEach((p: any) => (productMap[p.id] = p))

  //check if product is in stock /
  for (const item of items) {
    const product = productMap[item.product]
    if (!product || (product.stock ?? 0) < item.quantity) {
      return res.status(400).json({ message: 'product is out of stock' })
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
    }


  })
  const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 20 ? 0 : 1.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

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
      statusHistory: [{ status: "placed", note: "order placed", timestamp: new Date() }]
    }
  })

  return res.status(201).json(order);
}