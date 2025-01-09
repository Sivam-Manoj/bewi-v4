import Order from "../Model/orderModel";

interface Product {
  productId: string;
  productName: string;
  stockStatus: number; // Initial stock (maximum stock across all months)
  leftOver: number; // Final leftover stock
  availability: string; // Availability status
  average: number; // Average sales per month
  totalSales: number; // Total sales across all months
  months: number; // Total number of valid months the product is tracked
  enoughForMonths: number; // Months the final stock is enough for
}

export const stockAnalyzisBulk = async () => {
  try {
    // Fetch all orders (each order represents a month with rows of products)
    const orders = await Order.find().select(
      "-top10StockStatusProducts -totalStockStatus"
    );
    if (!orders || orders.length === 0) return [];

    const monthlyConsolidatedData: { [key: string]: Product[] } = {};
    const totalMonths = orders.length;

    // Step 1: Consolidate products for each month
    for (const order of orders) {
      const rows = Array.isArray(order.rows) ? order.rows : []; // Ensure rows is always an array
      const consolidatedStocks: { [key: string]: Product } = {};

      // Sum up stock statuses for duplicate products within the same month
      for (const product of rows) {
        const productId = product.productId;
        if (consolidatedStocks[productId]) {
          consolidatedStocks[productId].stockStatus += product.stockStatus;
        } else {
          consolidatedStocks[productId] = {
            productId: product.productId,
            productName: product.productName,
            stockStatus: product.stockStatus,
            leftOver: 0,
            availability: "Unknown",
            average: 0,
            totalSales: 0,
            months: 0,
            enoughForMonths: 0, // Placeholder
          };
        }
      }

      // Store consolidated data for the current month
      monthlyConsolidatedData[order.name] = Object.values(consolidatedStocks);
    }

    // Step 2: Calculate stats for each product
    const finalStockStatus: Product[] = [];
    const productIds = new Set<string>();

    // Gather all product IDs across all months
    Object.values(monthlyConsolidatedData).forEach((monthData) => {
      monthData.forEach((product) => productIds.add(product.productId));
    });

    // Process each product to calculate stats
    productIds.forEach((productId) => {
      let totalSales = 0;
      let initialStock = 0;
      let leftOver = 0;
      let validMonths = 0;

      const monthKeys = Object.keys(monthlyConsolidatedData).sort(); // Ensure chronological order
      let previousStock = 0;

      // Find the maximum stock as the initial stock
      monthKeys.forEach((monthKey) => {
        const monthData = monthlyConsolidatedData[monthKey];
        const product = monthData.find((p) => p.productId === productId);
        if (product) {
          if (product.stockStatus > initialStock) {
            initialStock = product.stockStatus; // Set maximum stock as initial stock
          }
        }
      });

      // Calculate sales, leftover, and count the number of valid months
      for (let i = 0; i < monthKeys.length; i++) {
        const monthData = monthlyConsolidatedData[monthKeys[i]];
        const product = monthData.find((p) => p.productId === productId);

        if (product) {
          if (i === 0) {
            // For the first month, set the previousStock to initial stock
            previousStock = initialStock;
          } else {
            // Calculate sales for the current period
            const sales = previousStock - product.stockStatus;

            if (sales > 0) {
              totalSales += sales; // Add valid sales
              validMonths++; // Increment valid months
              previousStock = product.stockStatus; // Update for the next iteration
            } else {
              // Skip this period if stock increases (sales <= 0)
              previousStock = product.stockStatus; // Update stock but skip counting
              continue;
            }
          }

          // Set leftover stock as the stock in the last valid month
          if (i === monthKeys.length - 1) {
            leftOver = product.stockStatus;
          }
        }
      }

      // Calculate availability based on leftover stock
      const availability = leftOver > 0 ? "Available" : "Out of Stock";

      // Calculate the average sales per valid month
      const average =
        validMonths > 0 ? parseFloat((totalSales / validMonths).toFixed(2)) : 0;

      // Calculate "enough for months" (how many months the final stock will last)
      const enoughForMonths =
        average > 0 ? parseFloat((leftOver / average).toFixed(2)) : 0;

      // Push the final product details
      const productName =
        monthlyConsolidatedData[monthKeys[0]].find(
          (product) => product.productId === productId
        )?.productName || "";

      finalStockStatus.push({
        productId,
        productName,
        stockStatus: initialStock, // Maximum stock as initial stock
        leftOver, // Final leftover stock after all valid months
        availability, // Availability status
        average, // Average sales per valid month
        totalSales, // Total valid sales across all months
        months: validMonths, // Total valid months
        enoughForMonths, // Months the final stock is enough for
      });
    });

    return finalStockStatus;
  } catch (error) {
    console.error("Error while consolidating stock data:", error);
    throw new Error("Error While searching data");
  }
};
