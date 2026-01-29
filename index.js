import express from "express";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/connetDB.js";
import { adminMiddleware } from "./middleware/authmiddleware.js";
import helmet from "helmet";
import authRoutes from "./routes/authentication.js";
import cors from "cors";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import testRoute from "./routes/test.js";
import { handleWebhook } from "./middleware/stripwebhook.js";

configDotenv(); // load .env first
const app = express();
const port = process.env.PORT || 3000;

// app.use(
//   "/api/webhook",
//   express.raw({ type: "application/json" }),
//   handleWebhook,
// );
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
  }),
);
// Connect to MongoDB once
await connectDB();

// users
app.use("/api/user", userRoutes);

//admin
app.use("/api/admin", adminMiddleware, adminRoutes);

//auth route
app.use("/api/auth", authRoutes);

app.use("/api", testRoute);
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
