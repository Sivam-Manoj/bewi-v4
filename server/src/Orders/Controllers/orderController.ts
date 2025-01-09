import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { addOrders } from "../Services/addNewOrder";
import Order from "../Model/orderModel";
import { getAllOrder } from "../Services/getAllOrders";
import { getTopStock } from "../Services/getTopStock";
import { getStockStatus } from "../Services/getStockStatus";
import { topSellingProducts } from "../Services/topSellingProducts";
import { deleteOrder } from "../Services/deleteOrder";
import { stockAnalyzisBulk } from "../Services/stockAnalyzis";

export const AddNewOrders = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new Error("No File Uploaded");
    }
    const file = req?.file;
    const { name, description } = req.body;

    try {
      const { rows, totalStockStatus, top10StockStatusProducts } =
        await addOrders(file, String(name));
      const order = new Order({
        name,
        description,
        rows,
        totalStockStatus,
        top10StockStatusProducts,
      });
      const orders = await order.save();
      res.status(200).json(orders);
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }
);

export const getOrders = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const orders = await getAllOrder();
      res.status(200).json(orders);
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }
);

export const getTop10StockOrders = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const topStockOrders = await getTopStock();
      res.status(200).json(topStockOrders);
    } catch (error) {
      throw new Error("internal server error");
    }
  }
);

export const getAllStockStatus = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const topStockOrders = await getStockStatus();
      res.status(200).json(topStockOrders);
    } catch (error) {
      throw new Error("internal server error");
    }
  }
);

export const getTopSellingProducts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const topStockOrders = await topSellingProducts();
      res.status(200).json(topStockOrders);
    } catch (error) {
      throw new Error("internal server error");
    }
  }
);

export const deleteOrders = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    try {
      const { message } = await deleteOrder(id);
      res.status(200).json(message);
    } catch (error) {
      throw new Error("Error While Deleting");
    }
  }
);

export const getStockAnalyzis = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const orders = await stockAnalyzisBulk();
      res.status(200).json(orders);
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }
);
