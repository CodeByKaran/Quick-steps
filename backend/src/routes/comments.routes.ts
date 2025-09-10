import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware.ts";
import {
  paginateComments,
  postComments,
} from "../controllers/comments.controller.ts";

const router = Router();

router.route("/:snippetId").post(AuthMiddleware, postComments);
router.route("/:snippetId").get(paginateComments);

export default router;
