import express from "express";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from "../controllers/addressController.js";
import auth from "../middleware/auth.js";

const addressRouter = express.Router();

addressRouter.use(auth);

addressRouter.get("/", getAddresses);
addressRouter.post("/", addAddress);
addressRouter.put("/:id", updateAddress);
addressRouter.delete("/:id", deleteAddress);

export default addressRouter;
