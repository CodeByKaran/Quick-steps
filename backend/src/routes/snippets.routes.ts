import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware.ts";
import { createSnippet } from "../controllers/snippets.controller.ts";

const router = Router();

router.route("/").post(AuthMiddleware, createSnippet);

export default router;
