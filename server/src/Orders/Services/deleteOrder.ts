import Order from "../Model/orderModel";

export const deleteOrder = async (id: string) => {
  try {
    await Order.findByIdAndDelete(id);
    return { message: "Order Deleted Succesfully" };
  } catch (error) {
    throw new Error("Error While searching data");
  }
};
