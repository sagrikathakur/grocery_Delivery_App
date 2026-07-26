import express from "express";
import {
  getProducts,
  getFlashDeals,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/flash-deals", getFlashDeals);
productRouter.get("/:id", getProductById);

// Admin protected routes
productRouter.post("/", auth, admin, createProduct);
productRouter.put("/:id", auth, admin, updateProduct);
productRouter.delete("/:id", auth, admin, deleteProduct);

export default productRouter;

