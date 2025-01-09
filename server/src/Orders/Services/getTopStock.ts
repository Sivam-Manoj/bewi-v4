import Order from "../Model/orderModel";

export const getTopStock = async () => {
  try {
    // Fetch all orders and only select the `top10StockStatusProducts` field
    const orders = await Order.find().select("top10StockStatusProducts");

    // Check if orders exist and return the `top10StockStatusProducts` field from each order
    const topStock = orders
      .map((order) => order.top10StockStatusProducts)
      .filter(Boolean);

    return topStock.length > 0 ? topStock : [];
  } catch (error: any) {
    throw new Error("Error while searching data: " + error.message);
  }
};
