import express, { NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { biezorMiddleware } from "biezor";
import { ConnectServerWithDb } from "../Config/Database";
import authRoutes from "../Auth/Routes/AuthRoutes";
import employeeRoutes from "../Employee/Routes/Routes";
import orderRoutes from "../Orders/Routes/orderRoutes";
import path from "path";
const app = express();

//defualt middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/auth", authRoutes);
app.use("/employee", employeeRoutes);
app.use("/order", orderRoutes);

//view static frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../../dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../../dist/index.html"));
  });
}

app.use((err: any, res: any, req: any, next: NextFunction) => {
  biezorMiddleware(err, res, req, next);
});

// database and server connection
ConnectServerWithDb(app);
