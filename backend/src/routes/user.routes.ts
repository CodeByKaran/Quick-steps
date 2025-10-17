import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import {
  userSignout,
  userSignin,
  userSignup,
  userDeletAccount,
  isUserSignedIn,
} from "../controllers/user.controller";
import { checkAlreadySignedIn } from "../middlewares/checkAlreadySignedIn ";

const router = Router();

router.route("/signup").post(checkAlreadySignedIn, userSignup);
router.route("/signin").post(checkAlreadySignedIn, userSignin);
router.route("/signout").post(userSignout);
router.route("/delete").delete(AuthMiddleware, userDeletAccount);
router.route("/check-session").get(isUserSignedIn);

export default router;
