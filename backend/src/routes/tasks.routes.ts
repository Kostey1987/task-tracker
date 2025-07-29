import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import * as tasksController from "../controllers/tasks.controller";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import { Request as ExpressRequest } from "express";
import { FileFilterCallback } from "multer";
import sharp from "sharp";
import fs from "fs";

const router = Router();
router.use(authMiddleware);

const upload = multer({
  dest: path.join(__dirname, "../../uploads"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (
    req: ExpressRequest,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
});

router.post(
  "/",
  upload.single("image"),
  [
    body("description").notEmpty().withMessage("Description is required"),
    body("deadline")
      .optional()
      .isISO8601({ strict: true })
      .withMessage(
        "Deadline must be a valid date and time in format YYYY-MM-DDTHH:mm"
      ),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.userId) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(401).json({ error: "User not authenticated" });
    }
    try {
      let imagePath: string | null = null;
      if (req.file) {
        const image = sharp(req.file.path);
        const metadata = await image.metadata();
        if (
          (metadata.width && metadata.width > 1920) ||
          (metadata.height && metadata.height > 1080)
        ) {
          fs.unlinkSync(req.file.path);
          return res
            .status(400)
            .json({ error: "Image resolution exceeds 1920x1080" });
        }
        imagePath = `/uploads/${req.file.filename}`;
      }
      const taskId = await tasksController.createTask({
        description: req.body.description,
        deadline: req.body.deadline,
        userId: req.userId,
        image: imagePath,
      });
      res.status(201).json({ id: taskId });
    } catch (err: any) {
      if (req.file && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      res.status(400).json({ error: err.message });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    if (!req.userId) throw new Error("User not authenticated");
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const deadlineFrom = req.query.deadlineFrom as string | undefined;
    const deadlineTo = req.query.deadlineTo as string | undefined;
    const sortDeadline = req.query.sortDeadline as "asc" | "desc" | undefined;
    const search = req.query.search as string | undefined;
    const result = await tasksController.getTasks(
      req.userId,
      page,
      limit,
      status || undefined,
      deadlineFrom || undefined,
      deadlineTo || undefined,
      sortDeadline,
      search
    );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch(
  "/:id",
  upload.single("image"),
  [
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    body("status")
      .optional()
      .isIn(["В работе", "Готово", "Просрочено"])
      .withMessage("Invalid status"),
    body("deadline")
      .optional()
      .isISO8601({ strict: true })
      .withMessage(
        "Deadline must be a valid date and time in format YYYY-MM-DDTHH:mm"
      ),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Проверка и замена изображения
      if (req.file) {
        const image = sharp(req.file.path);
        const metadata = await image.metadata();
        if (
          (metadata.width && metadata.width > 1920) ||
          (metadata.height && metadata.height > 1080)
        ) {
          fs.unlinkSync(req.file.path);
          return res
            .status(400)
            .json({ error: "Image resolution exceeds 1920x1080" });
        }
        const imagePath = `/uploads/${req.file.filename}`;
        await tasksController.updateTaskImage(
          parseInt(req.params.id),
          imagePath
        );
      }
      await tasksController.updateTask(parseInt(req.params.id), req.body);
      res.json({ message: "Task updated" });
    } catch (err: any) {
      if (req.file && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      res.status(400).json({ error: err.message });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    await tasksController.deleteTask(parseInt(req.params.id));
    res.json({ message: "Task deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id/image", async (req: Request, res: Response) => {
  try {
    await tasksController.removeTaskImage(parseInt(req.params.id));
    res.json({ message: "Task image deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
    file?: Express.Multer.File;
  }
}

export default router;
