import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// GET /api/addresses
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, addresses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/addresses
export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { label, address, city, state, zip, isDefault, lat, lng } = req.body;

    if (!label || !address || !city || !state || !zip) {
      return res.status(400).json({ success: false, message: "Missing required address fields" });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        label,
        address,
        city,
        state,
        zip,
        isDefault: !!isDefault,
        lat: Number(lat) || 0,
        lng: Number(lng) || 0
      }
    });

    res.status(201).json({ success: true, address: newAddress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/addresses/:id
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (req.body.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const updated = await prisma.address.update({
      where: { id: id as string },
      data: req.body
    });

    res.json({ success: true, address: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/addresses/:id
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.address.delete({
      where: { id: id as string }
    });

    res.json({ success: true, message: "Address deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
