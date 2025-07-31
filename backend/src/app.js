"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const tasks_routes_1 = __importDefault(require("./routes/tasks.routes"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(body_parser_1.default.json());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 минута
    max: 10000, // максимум 10000 запросов с одного IP
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Раздача статики для изображений
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/tasks", auth_middleware_1.authMiddleware, tasks_routes_1.default); // Защищенные маршруты
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});
exports.default = app;
