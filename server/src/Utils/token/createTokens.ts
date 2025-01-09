import jwt from "jsonwebtoken";
import { config } from "../../Config/config";
import { Response } from "express";

// Function to generate access token with user data
export const generateAccessToken = (
  userId: string,
  name: string,
  email: string,
  role: string
): string => {
  const payload = { userId, name, email, role }; // Add user info to the payload
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

// Function to generate refresh token with user data
export const generateRefreshToken = (
  userId: string,
  name: string,
  email: string,
  role: string
): string => {
  const payload = { userId, name, email, role }; // Add user info to the payload
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

// Function to send JWT tokens as cookies
export const sendTokensAsCookies = (
  res: Response,
  userId: string,
  name: string,
  email: string,
  role: string
) => {
  const accessToken = generateAccessToken(userId, name, email, role);
  const refreshToken = generateRefreshToken(userId, name, email, role);

  // Send the access token as a cookie
  res.cookie("access_token", accessToken, {
    httpOnly: true, // Prevent client-side access to the cookie
    secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // Max age in milliseconds
  });

  // Send the refresh token as a cookie
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true, // Prevent client-side access to the cookie
    secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // Max age in milliseconds
  });

  return { accessToken }; // Return the access token as a response object
};
