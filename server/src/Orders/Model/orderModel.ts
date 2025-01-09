import { model, Schema, Document } from "mongoose";

export interface IOrder extends Document {
  name: string;
  description: string;
  rows: object;
  totalStockStatus: number;
  top10StockStatusProducts: Array<{
    productId: string;
    productName: string;
    orderName: string; // Added orderName
    stockStatus: number;
  }>;
}

const OrderSchema = new Schema<IOrder>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rows: {
      type: Object,
      required: true,
    },
    totalStockStatus: {
      type: Number,
      required: true,
      default: 0,
    },
    top10StockStatusProducts: {
      type: [
        {
          productId: {
            type: String,
            required: true,
          },
          productName: {
            type: String,
            required: true,
          },
          orderName: {
            type: String, // Added orderName field
            required: true,
          },
          stockStatus: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = model<IOrder>("Order", OrderSchema);
export default Order;
