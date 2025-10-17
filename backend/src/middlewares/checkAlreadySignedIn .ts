import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SuccessResponse } from "../utils/apiSuccessResponse";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../controllers/user.controller";

// Optionally, use a persistent store for refresh tokens:
// import { saveRefreshToken, isValidRefreshToken, revokeRefreshToken } from "../utils/tokenStore";

export const checkAlreadySignedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  // Helper to send success response
  const sendSignInResponse = (
    user: any,
    accessToken: string,
    refreshToken: string
  ) => {
    // Set access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 60 minutes
    });
    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json(
      new SuccessResponse("User session validated", {
        user,
        tokens: { accessToken },
      })
    );
  };

  try {
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);
        return sendSignInResponse(decoded, accessToken, refreshToken);
      } catch (err: any) {
        // If access token expired, try refresh token
        if (err instanceof jwt.TokenExpiredError && refreshToken) {
          try {
            const jwtPayload = jwt.verify(
              refreshToken,
              process.env.JWT_REFRESH_SECRET!
            ) as any;

            // Refresh token rotation recommended:
            const newAccessToken = generateAccessToken({
              id: jwtPayload.id,
              username: jwtPayload.username,
              email: jwtPayload.email,
            });
            const newRefreshToken = generateRefreshToken({
              id: jwtPayload.id,
              username: jwtPayload.username,
              email: jwtPayload.email,
            });

            // Optionally, persist newRefreshToken and revoke old one here
            // await saveRefreshToken(jwtPayload.id, newRefreshToken);
            // await revokeRefreshToken(refreshToken);

            return sendSignInResponse(
              jwtPayload,
              newAccessToken,
              newRefreshToken
            );
          } catch (refreshErr) {
            // Invalid refresh token, pass to next (user not authenticated)
            return next();
          }
        }
        // Other errors, pass to next
        return next();
      }
    } else if (refreshToken) {
      // No accessToken, but refreshToken present
      try {
        const jwtPayload = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!
        ) as any;

        const newAccessToken = generateAccessToken({
          id: jwtPayload.id,
          username: jwtPayload.username,
          email: jwtPayload.email,
        });
        const newRefreshToken = generateRefreshToken({
          id: jwtPayload.id,
          username: jwtPayload.username,
          email: jwtPayload.email,
        });

        // Optionally, persist newRefreshToken and revoke old one
        // await saveRefreshToken(jwtPayload.id, newRefreshToken);
        // await revokeRefreshToken(refreshToken);

        return sendSignInResponse(jwtPayload, newAccessToken, newRefreshToken);
      } catch (err) {
        // Invalid refresh token, pass to next (user not authenticated)
        return next();
      }
    } else {
      // Neither token present, pass to next
      return next();
    }
  } catch (error) {
    // Forward caught error to error-handling middleware
    return next(error);
  }
};
