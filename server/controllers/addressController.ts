import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// GET /api/addresses
export const getAddresses = async (req: Request, res: Response) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" }
  });
  res.json({ addresses });
};

// POST /api/addresses
export const addAddress = async (req: Request, res: Response) => {
  const { label, address, city, state, zip, isDefault, lat, lng } = req.body;

  if (lat == null || lng == null) {
    return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
  }

  const currentAddresses = await prisma.address.findMany({
    where: { userId: req.user!.id }
  });

  let makeDefault = isDefault;
  if (currentAddresses.length === 0)
    makeDefault = true;

  if (makeDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user!.id },
      data: { isDefault: false }
    });
  }

  const newAddress = await prisma.address.create({
    data: {
      userId: req.user!.id,
      label,
      address,
      city,
      state,
      zip,
      isDefault: makeDefault,
      lat: Number(lat),
      lng: Number(lng)
    }
  });

  res.status(201).json({ success: true, address: newAddress });
};

// PUT /api/addresses/:id
export const updateAddress = async (req: Request, res: Response) => {
  const { label, address, city, state, zip, isDefault, lat, lng } = req.body;

  if (lat == null || lng == null) {
    return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user!.id },
      data: { isDefault: false }
    });
  }
  const data: any = {};
  if (label) data.label = label;
  if (address) data.address = address;
  if (city) data.city = city;
  if (state) data.state = state;
  if (zip) data.zip = zip;
  if (isDefault !== undefined) data.isDefault = isDefault;
  if (lat != null) data.lat = Number(lat);
  if (lng != null) data.lng = Number(lng);

  try {
    await prisma.address.update({
      where: { id: req.params.id as string },
      data,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "internal server error" });
  }
  const userAddresses = await prisma.address.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "asc" }
  });
  res.json({ success: true, addresses: userAddresses });
};

// DELETE /api/addresses/:id
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prisma.address.delete({ where: { id: req.params.id as string } });
  } catch (err: any) {
    console.log(err.message);
  }

  const userAddresses = await prisma.address.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "asc" }
  });
  res.json({ success: true, addresses: userAddresses });
};
