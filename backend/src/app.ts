import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.routes";
import tasksRoutes from "./routes/tasks.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import rateLimit from "express-rate-limit";
import path from "path";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 10000, // максимум 10000 запросов с одного IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Раздача статики для изображений
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, tasksRoutes); // Защищенные маршруты

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

export default app;
