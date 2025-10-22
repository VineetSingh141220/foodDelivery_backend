import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userModel from "./models/userModel.js";
import bcrypt from "bcrypt";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Temporary route to create admin user
app.post("/api/create-admin", async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email: "admin@tomato.com" });
    if (existingAdmin) {
      return res.json({ success: false, message: "Admin already exists" });
    }

    // Create hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Create admin user
    const adminUser = new userModel({
      name: "Admin User",
      email: "admin@tomato.com",
      password: hashedPassword,
      role: "admin",
      cartData: {}
    });

    await adminUser.save();
    res.json({ success: true, message: "Admin user created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});