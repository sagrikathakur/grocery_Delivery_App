import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const orderRouter = express.Router();

// User routes
orderRouter.post("/", auth, createOrder);
orderRouter.get("/", auth, getMyOrders);
orderRouter.get("/:id", auth, getOrderById);

// Admin routes
orderRouter.get("/admin/all", auth, admin, getAllOrders);
orderRouter.put("/:id/status", auth, admin, updateOrderStatus);

export default orderRouter;
