import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderLocation
} from "../controllers/orderController.js";


import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const orderRouter = express.Router();

// User routes
orderRouter.post("/", auth, createOrder);
orderRouter.get("/", auth, getUserOrders);
orderRouter.get("/:id", auth, getOrder);
orderRouter.get("/:id/location", auth, getOrderLocation);

// Admin routes
orderRouter.get("/admin/all", auth, admin, getAllOrders);
orderRouter.put("/:id/status", auth, admin, updateOrderStatus);

export default orderRouter;
