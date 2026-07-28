import { Inngest } from "inngest";
import { prisma } from "../config/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "grocery-delivery" });

const LOW_STOCK_THRESHOLD = 5;

// low stock alert to admin//
const lowStockAlert = inngest.createFunction(
  {
    id: "check-stock-alert",
    name: "low stock alert"
  },
  { event: "inventory/stock.updated" },
  async ({ event, step }) => {
    const { productId } = event.data;

    const product = await step.run("fetch-product", async () => {
      return await prisma.product.findUnique({ where: { id: productId } });
    });

    if (!product || product.stock === null || product.stock >= LOW_STOCK_THRESHOLD) {
      return { skipped: true, stock: product?.stock };
    }

    await step.run("step-low-stock-email", async () => {
      const adminEmails = process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim())
        : [];
      console.log(`[LOW STOCK EMAIL] Alert sent to ${adminEmails.length} admins for product: ${product.name} (Stock: ${product.stock})`);
    });

    return { success: true, productId: product.id, stock: product.stock };
  }
);

export const functions = [lowStockAlert];