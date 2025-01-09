import Order from "../Model/orderModel";

export const getStockStatus = async () => {
  try {
    // Fetch all orders, selecting only `totalStockStatus` and `name` fields
    const orders = await Order.find().select("totalStockStatus name");

    // Check if orders exist and map the required fields
    const stockData = orders.map((order) => ({
      orderName: order.name,
      totalStockStatus: order.totalStockStatus,
    }));

    // Return the mapped data if it exists; otherwise, return an empty array
    return stockData.length > 0 ? stockData : [];
  } catch (error: any) {
    // Handle errors properly
    throw new Error("Error while fetching stock status: " + error.message);
  }
};
