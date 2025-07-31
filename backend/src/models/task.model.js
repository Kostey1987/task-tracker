"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
exports.getTasks = getTasks;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.removeTaskImage = removeTaskImage;
const db_1 = require("../config/db");
function createTask(task) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        const result = yield db.run("INSERT INTO tasks (description, deadline, status, image, user_id) VALUES (?, ?, ?, ?, ?)", [
            task.description,
            task.deadline || null,
            task.status || "В работе",
            task.image || null,
            task.userId,
        ]);
        return result.lastID;
    });
}
function getTasks(userId, page, limit, status, deadlineFrom, deadlineTo, sortDeadline, search) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        const offset = (page - 1) * limit;
        let query = "SELECT * FROM tasks WHERE user_id = ?";
        const params = [userId];
        if (status != null) {
            query += " AND status = ?";
            params.push(status);
        }
        if (deadlineFrom != null) {
            query += " AND deadline >= ?";
            params.push(deadlineFrom);
        }
        if (deadlineTo != null) {
            query += " AND deadline <= ?";
            params.push(deadlineTo);
        }
        if (search != null) {
            query += " AND description LIKE ?";
            params.push(`%${search}%`);
        }
        if (sortDeadline === "asc") {
            query += " ORDER BY deadline ASC";
        }
        else if (sortDeadline === "desc") {
            query += " ORDER BY deadline DESC";
        }
        query += " LIMIT ? OFFSET ?";
        params.push(limit, offset);
        const tasks = yield db.all(query, params);
        // Для корректного total учитываем фильтры
        let countQuery = "SELECT COUNT(*) as count FROM tasks WHERE user_id = ?";
        const countParams = [userId];
        if (status != null) {
            countQuery += " AND status = ?";
            countParams.push(status);
        }
        if (deadlineFrom != null) {
            countQuery += " AND deadline >= ?";
            countParams.push(deadlineFrom);
        }
        if (deadlineTo != null) {
            countQuery += " AND deadline <= ?";
            countParams.push(deadlineTo);
        }
        if (search != null) {
            countQuery += " AND description LIKE ?";
            countParams.push(`%${search}%`);
        }
        const total = yield db.get(countQuery, countParams);
        return {
            tasks,
            total: total.count,
            page,
            totalPages: Math.ceil(total.count / limit),
        };
    });
}
function updateTask(taskId, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        const fields = [];
        const values = [];
        if (updates.description) {
            fields.push("description = ?");
            values.push(updates.description);
        }
        if (updates.status) {
            fields.push("status = ?");
            values.push(updates.status);
        }
        if (updates.deadline) {
            fields.push("deadline = ?");
            values.push(updates.deadline);
        }
        if (updates.image != null) {
            fields.push("image = ?");
            values.push(updates.image);
        }
        if (fields.length === 0)
            throw new Error("No fields to update");
        values.push(taskId);
        yield db.run(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`, values);
    });
}
function deleteTask(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        yield db.run("DELETE FROM tasks WHERE id = ?", [taskId]);
    });
}
function removeTaskImage(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        const task = yield db.get("SELECT image FROM tasks WHERE id = ?", [taskId]);
        if (!task || !task.image)
            return null;
        yield db.run("UPDATE tasks SET image = NULL WHERE id = ?", [taskId]);
        return task.image;
    });
}
