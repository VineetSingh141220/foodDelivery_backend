import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import serverless from "serverless-http";
import "dotenv/config";

const app = express();

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

app.get("/", (req, res) => {
  res.send("API Working");
});

// Local run ke liye (sirf development me)
if (process.env.NODE_ENV !== "production") {
  app.listen(4000, () => console.log("Local server running..."));
}

// Vercel/Netlify ke liye (serverless function)
export const handler = serverless(app);
