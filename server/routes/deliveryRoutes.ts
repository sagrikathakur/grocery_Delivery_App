import express from "express";
import {
  deliveryLogin,
  getAssignedOrders,
  updateDeliveryOrderStatus,
  updateOrderLocation
} from "../controllers/deliveryController.js";
import deliveryAuth from "../middleware/deliveryAuth.js";

const deliveryRouter = express.Router();

deliveryRouter.post("/login", deliveryLogin);

// Protected delivery partner routes
deliveryRouter.get("/orders", deliveryAuth, getAssignedOrders);
deliveryRouter.put("/order-status", deliveryAuth, updateDeliveryOrderStatus);
deliveryRouter.put("/location", deliveryAuth, updateOrderLocation);

export default deliveryRouter;
