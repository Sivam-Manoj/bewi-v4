import { connect } from "mongoose";
import { Express } from "express";
import { mongo_url, port } from "./config";
export const ConnectServerWithDb = async (app: Express) => {
  try {
    await connect(mongo_url);
    console.log("database connected successfully");
    app.listen(port, () => {
      console.log(`server running on: http://localhost:3000`);
    });
  } catch {
    console.log("Error connecting to MongoDB");
  }
};
