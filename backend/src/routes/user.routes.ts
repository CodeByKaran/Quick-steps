import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware.ts";
import { userSignin, userSignup } from "../controllers/user.controller.ts";
import { checkAlreadySignedIn } from "../middlewares/checkAlreadySignedIn .ts";

const router = Router();

router.route("/signup").post(checkAlreadySignedIn, userSignup);
router.route("/signin").post(checkAlreadySignedIn, userSignin);

export default router;
