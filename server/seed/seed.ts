import { mongo_url } from "./../src/Config/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Auth from "../src/Auth/Model/AuthModel";

// MongoDB connection URI (Replace with your own MongoDB URI)
const mongoUri = mongo_url; // Update with actual database URI

// Seed data for super_admin user
const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Define super_admin credentials
    const username = "admin boss";
    const email = "admin@email.com"; // Replace with the intended email
    const role = "super_admin";
    const rawPassword = "Admin@1234";

    // Check if the super_admin user already exists
    const existingUser = await Auth.findOne({ username });
    if (existingUser) {
      console.log("Super admin already exists, no need to seed.");
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // Create the super_admin user
    const superAdmin = new Auth({
      username,
      password: hashedPassword,
      email,
      role,
    });

    // Save the super_admin user to the database
    await superAdmin.save();
    console.log("Super admin user seeded successfully.");
  } catch (error) {
    console.error("Error seeding super admin:", error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the seed function
seedSuperAdmin();
