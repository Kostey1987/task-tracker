"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const tasksController = __importStar(require("../controllers/tasks.controller"));
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
const upload = (0, multer_1.default)({
    dest: path_1.default.join(__dirname, "../../uploads"),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/"))
            cb(null, true);
        else
            cb(new Error("Only images are allowed"));
    },
});
router.post("/", upload.single("image"), [
    (0, express_validator_1.body)("description").notEmpty().withMessage("Description is required"),
    (0, express_validator_1.body)("deadline")
        .optional()
        .isISO8601({ strict: true })
        .withMessage("Deadline must be a valid date and time in format YYYY-MM-DDTHH:mm"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        if (req.file)
            fs_1.default.unlinkSync(req.file.path);
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.userId) {
        if (req.file)
            fs_1.default.unlinkSync(req.file.path);
        return res.status(401).json({ error: "User not authenticated" });
    }
    try {
        let imagePath = null;
        if (req.file) {
            const image = (0, sharp_1.default)(req.file.path);
            const metadata = yield image.metadata();
            if ((metadata.width && metadata.width > 1920) ||
                (metadata.height && metadata.height > 1080)) {
                fs_1.default.unlinkSync(req.file.path);
                return res
                    .status(400)
                    .json({ error: "Image resolution exceeds 1920x1080" });
            }
            imagePath = `/uploads/${req.file.filename}`;
        }
        const taskId = yield tasksController.createTask({
            description: req.body.description,
            deadline: req.body.deadline,
            userId: req.userId,
            image: imagePath,
        });
        res.status(201).json({ id: taskId });
    }
    catch (err) {
        if (req.file && fs_1.default.existsSync(req.file.path))
            fs_1.default.unlinkSync(req.file.path);
        res.status(400).json({ error: err.message });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId)
            throw new Error("User not authenticated");
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const deadlineFrom = req.query.deadlineFrom;
        const deadlineTo = req.query.deadlineTo;
        const sortDeadline = req.query.sortDeadline;
        const search = req.query.search;
        const result = yield tasksController.getTasks(req.userId, page, limit, status || null, deadlineFrom || null, deadlineTo || null, sortDeadline, search);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
router.patch("/:id", upload.single("image"), [
    (0, express_validator_1.body)("description")
        .optional()
        .notEmpty()
        .withMessage("Description cannot be empty"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["В работе", "Готово", "Просрочено"])
        .withMessage("Invalid status"),
    (0, express_validator_1.body)("deadline")
        .optional()
        .isISO8601({ strict: true })
        .withMessage("Deadline must be a valid date and time in format YYYY-MM-DDTHH:mm"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        if (req.file)
            fs_1.default.unlinkSync(req.file.path);
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Проверка и замена изображения
        if (req.file) {
            const image = (0, sharp_1.default)(req.file.path);
            const metadata = yield image.metadata();
            if ((metadata.width && metadata.width > 1920) ||
                (metadata.height && metadata.height > 1080)) {
                fs_1.default.unlinkSync(req.file.path);
                return res
                    .status(400)
                    .json({ error: "Image resolution exceeds 1920x1080" });
            }
            const imagePath = `/uploads/${req.file.filename}`;
            yield tasksController.updateTaskImage(parseInt(req.params.id), imagePath);
        }
        yield tasksController.updateTask(parseInt(req.params.id), req.body);
        res.json({ message: "Task updated" });
    }
    catch (err) {
        if (req.file && fs_1.default.existsSync(req.file.path))
            fs_1.default.unlinkSync(req.file.path);
        res.status(400).json({ error: err.message });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield tasksController.deleteTask(parseInt(req.params.id));
        res.json({ message: "Task deleted" });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
router.delete("/:id/image", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield tasksController.removeTaskImage(parseInt(req.params.id));
        res.json({ message: "Task image deleted" });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
exports.default = router;
