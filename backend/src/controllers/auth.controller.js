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
exports.refresh = exports.logout = exports.updateUser = exports.login = exports.register = void 0;
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
function generateRefreshToken() {
    return crypto_1.default.randomBytes(40).toString("hex");
}
const register = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_model_1.createUser)({ name, email, password });
});
exports.register = register;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_model_1.findUserByEmail)(email);
    if (!user)
        throw new Error("User not found");
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "15s",
    });
    const refreshToken = generateRefreshToken();
    yield (0, user_model_1.saveRefreshToken)(user.id, refreshToken);
    return { accessToken, refreshToken };
});
exports.login = login;
const updateUser = (userId, newName) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_model_1.updateUser)(userId, newName);
});
exports.updateUser = updateUser;
const logout = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_model_1.removeRefreshToken)(userId);
});
exports.logout = logout;
const refresh = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_model_1.getUserByRefreshToken)(refreshToken);
    if (!user) {
        throw new Error("Invalid refresh token");
    }
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "15s",
    });
    // Генерируем новый refresh token для ротации
    const newRefreshToken = generateRefreshToken();
    yield (0, user_model_1.saveRefreshToken)(user.id, newRefreshToken);
    return { accessToken, refreshToken: newRefreshToken };
});
exports.refresh = refresh;
