require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const connectDB = require("./src/config/db");

// ================= MIDDLEWARE =================
const sanitizeInput = require("./src/middleware/sanitize");
const preventInjection = require("./src/middleware/injectPrevention");
const {
  notFound,
  errorHandler,
} = require("./src/middleware/errorMiddleware");


// ================= ROUTES =================
const authRoutes = require("./src/routes/auth");
const transactionRoutes = require("./src/routes/transactions");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

// OPTIONAL ROUTES (only if they exist)
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const fraudRoutes = require("./src/routes/fraudRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

// ================= APP =================
const app = express();
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

const server = http.createServer(app);

// ================= DATABASE =================
connectDB();

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ================= SECURITY =================
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());

app.use(sanitizeInput);
app.use(preventInjection);

// ================= RATE LIMIT =================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests. Try again later.",
  },
});

app.use("/api", apiLimiter);

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Optional routes (only if loaded)
if (analyticsRoutes) app.use("/api/analytics", analyticsRoutes);
if (fraudRoutes) app.use("/api/fraud", fraudRoutes);
if (settingsRoutes) app.use("/api/settings", settingsRoutes);
if (adminRoutes) app.use("/api/admin", adminRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FraudGuard Backend Running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    server: "FraudGuard",
    status: "Running",
    timestamp: new Date(),
  });
});

// ================= 404 =================
app.use(notFound);

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `🚀 FraudGuard running on port ${PORT} [${process.env.NODE_ENV}]`
  );
});

module.exports = { app, server };