import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// GET /api/products/flash-deals
export const getFlashDeals = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { originalPrice: "desc" }
    });

    const productsWithDiscount = products.map((p: any) => {
      const discount = p.originalPrice && p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;
      return { ...p, discount };
    });

    res.json({
      success: true,
      products: productsWithDiscount.slice(0, 8)
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products - Get all products with search, category, price filter & sorting
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    const where: any = {};

    if (category && category !== "all") {
      where.category = category as string;
    }

    if (search) {
      where.name = { contains: search as string, mode: "insensitive" };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const orderBy: any = {};
    if (sort === "price-low") orderBy.price = "asc";
    else if (sort === "price-high") orderBy.price = "desc";
    else orderBy.createdAt = "desc";

    const products = await prisma.product.findMany({
      where,
      orderBy
    });

    const productsWithDiscount = products.map((p: any) => {
      const discount = p.originalPrice && p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;
      return { ...p, discount };
    });

    res.json({
      success: true,
      count: productsWithDiscount.length,
      products: productsWithDiscount
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:id - Get single product by ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id as string } });

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const discount = product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    res.json({ success: true, product: { ...product, discount } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = getProduct;

// POST /api/products - Create product (Admin)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });
    res.status(201).json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:id - Update product (Admin)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id as string },
      data: req.body
    });
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id - Delete product (Admin)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};