import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SuccessResponse } from "../utils/apiSuccessResponse.ts";

export const checkAlreadySignedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
      // User already signed in
      return res.status(200).json(
        new SuccessResponse("User already signed in", {
          user: decoded,
          tokens: { accessToken: token },
        })
      );
    } catch {
      // Token invalid or expired, continue to signin controller
      next();
    }
  } else {
    // No token, proceed
    next();
  }
};
