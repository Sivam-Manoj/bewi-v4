import dotenv from "dotenv";
dotenv.config();

export const config = {
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "defaultAccessSecret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  },
};

export const port = Number(process.env.PORT || 3000);
export const mongo_url = String(process.env.MONGO_URL);
