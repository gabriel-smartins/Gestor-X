import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import User from "./models/User.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

// Rode com: node seed.js

const register = async () => {
  try {
    await connectToMongoDB();
    
    const existingUser = await User.findOne({ email: "admin@gmail.com" });
    if (existingUser) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin", 10);
    const newUser = new User({
      name: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      address: "KBL",
      role: "admin"
    });

    await newUser.save();
    console.log("Admin created");
  } catch (err) {
    console.error("Error creating admin:", err);
  }
};

register();
