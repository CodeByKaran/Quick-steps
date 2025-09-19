import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import {
  paginateComments,
  postComments,
} from "../controllers/comments.controller";

const router = Router();

router.route("/:snippetId").post(AuthMiddleware, postComments);
router.route("/:snippetId").get(paginateComments);

export default router;
