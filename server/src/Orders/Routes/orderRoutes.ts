import { Router } from "express";
import upload from "../../Utils/multer/multer";
import {
  AddNewOrders,
  deleteOrders,
  getAllStockStatus,
  getOrders,
  getStockAnalyzis,
  getTop10StockOrders,
  getTopSellingProducts,
} from "../Controllers/orderController";

const router = Router();

router.post("/add", upload.single("file"), AddNewOrders);
router.get("/get-all", getOrders);
router.get("/get-top-stocks", getTop10StockOrders);
router.get("/get-stock-status", getAllStockStatus);
router.get("/get-top-products", getTopSellingProducts);
router.delete("/delete/:id", deleteOrders);
router.get("/stock-analyzis", getStockAnalyzis);
export default router;
