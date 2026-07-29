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

// Admin routes
orderRouter.get("/admin/all", auth, admin, getAllOrders);
orderRouter.put("/:id/status", auth, admin, updateOrderStatus);

// User routes
orderRouter.post("/", auth, createOrder);
orderRouter.get("/", auth, getUserOrders);
orderRouter.get('/all', auth, admin, getAllOrders)
orderRouter.get("/:id", auth, getOrder);
orderRouter.get('/:id/location', auth, getOrderLocation)

export default orderRouter;
