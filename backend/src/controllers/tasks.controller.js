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
exports.updateTaskImage = exports.removeTaskImage = exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const task_model_1 = require("../models/task.model");
const fs_1 = __importDefault(require("fs"));
const createTask = (task) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, task_model_1.createTask)(task);
});
exports.createTask = createTask;
const getTasks = (userId, page, limit, status, deadlineFrom, deadlineTo, sortDeadline, search) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, task_model_1.getTasks)(userId, page, limit, status || null, deadlineFrom || null, deadlineTo || null, sortDeadline || null, search);
});
exports.getTasks = getTasks;
const updateTask = (taskId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, task_model_1.updateTask)(taskId, updates);
});
exports.updateTask = updateTask;
const deleteTask = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, task_model_1.deleteTask)(taskId);
});
exports.deleteTask = deleteTask;
const removeTaskImage = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    const imagePath = yield (0, task_model_1.removeTaskImage)(taskId);
    if (imagePath) {
        const absPath = `backend${imagePath.replace("/", "\\")}`;
        if (fs_1.default.existsSync(absPath))
            fs_1.default.unlinkSync(absPath);
    }
});
exports.removeTaskImage = removeTaskImage;
const updateTaskImage = (taskId, newImagePath) => __awaiter(void 0, void 0, void 0, function* () {
    // Удалить старое изображение, если есть
    const oldImage = yield (0, task_model_1.removeTaskImage)(taskId);
    if (oldImage) {
        const absPath = `backend${oldImage.replace("/", "\\")}`;
        if (fs_1.default.existsSync(absPath))
            fs_1.default.unlinkSync(absPath);
    }
    // Обновить поле image новым путём
    const db = yield (yield Promise.resolve().then(() => __importStar(require("../config/db")))).getDb();
    yield db.run("UPDATE tasks SET image = ? WHERE id = ?", [
        newImagePath,
        taskId,
    ]);
});
exports.updateTaskImage = updateTaskImage;
