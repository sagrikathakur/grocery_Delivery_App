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

}