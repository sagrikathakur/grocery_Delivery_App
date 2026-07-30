import express from "express";
import {
  deliveryLogin,
  getAssignedOrders,
  updateDeliveryOrderStatus,
  updateOrderLocation,
  getPartnerProfile
} from "../controllers/deliveryPartnerController.js";
import deliveryAuth from "../middleware/deliveryAuth.js";

const deliveryPartnerRouter = express.Router();

// Public authentication route
deliveryPartnerRouter.post("/login", deliveryLogin);

// Protected delivery partner routes
deliveryPartnerRouter.get("/orders", deliveryAuth, getAssignedOrders);
deliveryPartnerRouter.put("/order-status", deliveryAuth, updateDeliveryOrderStatus);
deliveryPartnerRouter.put("/location", deliveryAuth, updateOrderLocation);
deliveryPartnerRouter.get("/profile", deliveryAuth, getPartnerProfile);

export default deliveryPartnerRouter;
