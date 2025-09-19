import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";

const app = express();

// middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
  credentials: true
}));

// DB connection - Add error handling
let dbConnected = false;
const initDB = async () => {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

// Initialize DB connection
initDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.json({ 
    message: "API Working ✅",
    status: "success",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    database: dbConnected ? "connected" : "disconnected"
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl
  });
});

// Port for local development
const PORT = process.env.PORT || 4000;

// Only listen on port in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
export default app;
