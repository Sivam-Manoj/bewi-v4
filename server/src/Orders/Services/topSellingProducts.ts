import Order from "../Model/orderModel";

// Define the structure of the rows
interface Product {
  productId: string;
  productName: string;
  stockStatus: number;
  purchasePrice: {
    net: number;
    gross: number;
  };
  valueAtPurchase: {
    net: number;
    gross: number;
  };
}

// Define the structure of the order
interface OrderDocument {
  rows: Product[];
}

export const topSellingProducts = async (): Promise<Product[]> => {
  try {
    // Fetch only the rows field from all orders
    const orders: OrderDocument[] = await Order.find().select("rows");

    if (!orders || orders.length === 0) {
      return [];
    }

    // Flatten all rows from all orders into a single array
    const allProducts: Product[] = orders.flatMap((order) => order.rows);

    // Combine duplicate products by summing their stockStatus
    const productMap: Record<string, Product> = {};

    allProducts.forEach((product) => {
      if (productMap[product.productId]) {
        // If product exists, sum the stockStatus
        productMap[product.productId].stockStatus += product.stockStatus;
      } else {
        // Otherwise, add the product to the map
        productMap[product.productId] = { ...product };
      }
    });

    // Convert the product map back to an array
    const combinedProducts = Object.values(productMap);

    // Sort the products by stockStatus in descending order and take the top 10
    const topProducts = combinedProducts
      .sort((a, b) => b.stockStatus - a.stockStatus)
      .slice(0, 50);

    return topProducts;
  } catch (error: any) {
    throw new Error("Error while searching data: " + error.message);
  }
};
