import { Router, Request, Response } from "express";
import {
  register,
  login,
  updateUser,
  logout,
  refresh,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { body, validationResult } from "express-validator";
import { findUserById } from "../models/user.model";

const router = Router();

// Регистрация
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      await register(req.body.name, req.body.email, req.body.password);
      res.status(201).json({ message: "User registered" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Авторизация
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Введите корректный email"),
    body("password").notEmpty().withMessage("Введите пароль"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const tokens = await login(req.body.email, req.body.password);
      res.json({ token: tokens });
    } catch (error: any) {
      let statusCode = 401;
      let message = "Authentication failed";

      if (error.message === "USER_NOT_FOUND") {
        message = "Пользователь с таким email не найден";
      } else if (error.message === "INVALID_PASSWORD") {
        message = "Неверный пароль";
      }

      res.status(statusCode).json({ error: message });
    }
  }
);

// Обновление данных
router.patch("/update", authMiddleware, async (req: any, res) => {
  try {
    await updateUser(req.userId, req.body.newName);
    res.json({ message: "User updated" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Logout endpoint
router.post("/logout", authMiddleware, async (req: Request, res: Response) => {
  await logout(req.userId!);
  res.status(200).json({ message: "Logged out" });
});

router.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }
  try {
    const tokens = await refresh(refreshToken);
    res.json(tokens);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// Профиль пользователя
router.get("/profile", authMiddleware, async (req: any, res: Response) => {
  try {
    const user = await findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
