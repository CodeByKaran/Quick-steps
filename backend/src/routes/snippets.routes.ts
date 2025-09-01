import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware.ts";
import {
  createSnippet,
  updateSnippet,
  deleteSnippet,
  getSnippetById,
  paginateRandomSnippets,
  PaginateUserSnippets,
  paginateMySnippets,
  paginateSnippetsByTags,
  searchSnippets, // Add this import
} from "../controllers/snippets.controller.ts";

const router = Router();

// POST route
router.route("/").post(AuthMiddleware, createSnippet);

// Static routes FIRST (before parameterized routes)
router.route("/random").get(paginateRandomSnippets);
router.route("/me").get(AuthMiddleware, paginateMySnippets);
router.route("/tags").get(paginateSnippetsByTags);
router.route("/search").get(searchSnippets); // Add search route
router.route("/user/:userId").get(PaginateUserSnippets);

// Parameterized routes LAST (after all static routes)
router.route("/:id").get(getSnippetById);
router.route("/:id").put(AuthMiddleware, updateSnippet);
router.route("/:id").delete(AuthMiddleware, deleteSnippet);

export default router;
