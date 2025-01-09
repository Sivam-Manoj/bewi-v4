import * as XLSX from "xlsx";

export const addOrders = async (
  file: Express.Multer.File,
  name: string
): Promise<any> => {
  try {
    if (!file || !file.buffer) {
      throw new Error("Invalid file. No file buffer found.");
    }

    const workbook: XLSX.WorkBook = XLSX.read(file.buffer, { type: "buffer" });

    // Step 1: Get the first sheet
    const sheetName: string = workbook.SheetNames[0];
    const sheet: XLSX.WorkSheet | undefined = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in the workbook.`);
    }

    // Step 2: Convert the sheet into JSON format, starting from the 7th row
    const data: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1, // Treat the first row as header
      defval: null, // Handle missing values
    }) as unknown[][];

    // Step 3: Start processing data from the 7th row (index 6)
    const rows = data.slice(6); // 7th row is index 6

    if (rows.length === 0) {
      throw new Error(
        "The uploaded Excel file contains no valid data from the 7th row."
      );
    }

    // Define the headers based on the provided column structure
    const headers = [
      "productId", // 1. product id
      "productName", // 2. product name
      "stockStatus", // 3. stock status
      "netPurchasePrice", // 4. Unit purchase price - net
      "grossPurchasePrice", // 4. Unit purchase price - gross
      "netValueAtPurchase", // 5. Value at purchase prices - net
      "grossValueAtPurchase", // 5. Value at purchase prices - gross
    ];

    // Step 4: Extract relevant information into rows
    const processedRows = rows.map((row) => {
      const [
        productId,
        productName,
        stockStatus,
        netPurchasePrice,
        grossPurchasePrice,
        netValueAtPurchase,
        grossValueAtPurchase,
      ] = row;

      // Make sure stockStatus and other numerical values are parsed as numbers (if valid)
      return {
        productId: productId || null,
        productName: productName || null,
        stockStatus: Number(stockStatus) || 0, // Ensure stockStatus is a number
        purchasePrice: {
          net: Number(netPurchasePrice) || 0, // Ensure it's a number
          gross: Number(grossPurchasePrice) || 0, // Ensure it's a number
        },
        valueAtPurchase: {
          net: Number(netValueAtPurchase) || 0, // Ensure it's a number
          gross: Number(grossValueAtPurchase) || 0, // Ensure it's a number
        },
      };
    });

    const totalStockStatus = processedRows.reduce(
      (sum, row) => sum + (row.stockStatus || 0),
      0
    );

    const top10StockStatusProducts = processedRows
      .sort((a, b) => b.stockStatus - a.stockStatus)
      .slice(0, 10)
      .map((row) => ({
        productId: row.productId,
        productName: row.productName,
        orderName: name,
        stockStatus: row.stockStatus,
      }));

    return {
      rows: processedRows,
      totalStockStatus,
      top10StockStatusProducts,
    };
  } catch (error: any) {
    console.error("Error processing Excel file:", error.message);
    throw error;
  }
};
