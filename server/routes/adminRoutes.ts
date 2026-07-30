import express from "express";
import {
  getAdminStats,
  getDeliveryPartners,
  addDeliveryPartner,
  togglePartnerStatus,
  assignOrderPartner,
  getAllUsers
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const adminRouter = express.Router();

// Protected Admin Routes
adminRouter.get("/stats", auth, admin, getAdminStats);
adminRouter.get("/partners", auth, admin, getDeliveryPartners);
adminRouter.post("/partners", auth, admin, addDeliveryPartner);
adminRouter.put("/partners/:id/status", auth, admin, togglePartnerStatus);
adminRouter.put("/orders/:id/assign", auth, admin, assignOrderPartner);
adminRouter.get("/users", auth, admin, getAllUsers);

export default adminRouter;
