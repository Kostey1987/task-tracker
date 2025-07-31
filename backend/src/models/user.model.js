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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.updateUser = updateUser;
exports.saveRefreshToken = saveRefreshToken;
exports.getUserByRefreshToken = getUserByRefreshToken;
exports.removeRefreshToken = removeRefreshToken;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        const hashedPassword = yield bcryptjs_1.default.hash(user.password, 10);
        yield db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
            user.name,
            user.email,
            hashedPassword,
        ]);
    });
}
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        return db.get("SELECT * FROM users WHERE email = ?", [email]);
    });
}
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        return db.get("SELECT * FROM users WHERE id = ?", [id]);
    });
}
function updateUser(userId, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        yield db.run("UPDATE users SET name = ? WHERE id = ?", [newName, userId]);
    });
}
function saveRefreshToken(userId, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        yield db.run("UPDATE users SET refresh_token = ? WHERE id = ?", [
            refreshToken,
            userId,
        ]);
    });
}
function getUserByRefreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        return db.get("SELECT * FROM users WHERE refresh_token = ?", [refreshToken]);
    });
}
function removeRefreshToken(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.getDb)();
        yield db.run("UPDATE users SET refresh_token = NULL WHERE id = ?", [userId]);
    });
}
