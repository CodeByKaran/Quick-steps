import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware.ts";
import {
  userSignout,
  userSignin,
  userSignup,
  userDeletAccount,
} from "../controllers/user.controller.ts";
import { checkAlreadySignedIn } from "../middlewares/checkAlreadySignedIn .ts";

const router = Router();

router.route("/signup").post(checkAlreadySignedIn, userSignup);
router.route("/signin").post(checkAlreadySignedIn, userSignin);
router.route("/signout").post(userSignout);
router.route("/delete").delete(AuthMiddleware, userDeletAccount);

export default router;
