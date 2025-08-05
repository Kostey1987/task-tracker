import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import * as tasksController from "../controllers/tasks.controller";
import { body, validationResult } from "express-validator";

const router = Router();
router.use(authMiddleware);

router.post(
  "/",
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
      return res.status(400).json({ errors: errors.array() });
    }
    if (!(req as any).userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    try {
      const taskId = await tasksController.createTask({
        description: req.body.description,
        deadline: req.body.deadline,
        userId: (req as any).userId,
      });
      res.status(201).json({ id: taskId });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.get("/", async (req: Request, res: Response) => {
  try {
    if (!(req as any).userId) throw new Error("User not authenticated");
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const deadlineFrom = req.query.deadlineFrom as string | undefined;
    const deadlineTo = req.query.deadlineTo as string | undefined;
    const sortDeadline = req.query.sortDeadline as "asc" | "desc" | undefined;
    const search = req.query.search as string | undefined;
    const result = await tasksController.getTasks(
      (req as any).userId,
      page,
      limit,
      status || null,
      deadlineFrom || null,
      deadlineTo || null,
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
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      await tasksController.updateTask(parseInt(req.params.id), req.body);
      res.json({ message: "Task updated" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await tasksController.deleteTask(parseInt(req.params.id));
    res.json({ message: "Task deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}

export default router;
