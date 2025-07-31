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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_validator_1 = require("express-validator");
const user_model_1 = require("../models/user.model");
const router = (0, express_1.Router)();
// Регистрация
router.post("/register", [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        yield (0, auth_controller_1.register)(req.body.name, req.body.email, req.body.password);
        res.status(201).json({ message: "User registered" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Авторизация
router.post("/login", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const token = yield (0, auth_controller_1.login)(req.body.email, req.body.password);
        res.json({ token });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
}));
// Обновление данных
router.patch("/update", auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, auth_controller_1.updateUser)(req.userId, req.body.newName);
        res.json({ message: "User updated" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Logout endpoint
router.post("/logout", auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_controller_1.logout)(req.userId);
    res.status(200).json({ message: "Logged out" });
}));
router.post("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token required" });
    }
    try {
        const tokens = yield (0, auth_controller_1.refresh)(refreshToken);
        res.json(tokens);
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
}));
// Профиль пользователя
router.get("/profile", auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_model_1.findUserById)(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { password } = user, userData = __rest(user, ["password"]);
        res.json(userData);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
