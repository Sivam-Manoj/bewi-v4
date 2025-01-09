import Order from "../Model/orderModel";

export const getAllOrder = async () => {
  try {
    const orders = await Order.find().select("-rows");
    return orders ? orders : [];
  } catch (error) {
    throw new Error("Error While searching data");
  }
};
