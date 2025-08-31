import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SuccessResponse } from "../utils/apiSuccessResponse.ts";
import { ca } from "zod/locales";
import { ErrorResponse } from "../utils/apiErrorResponse.ts";

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
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
          try {
            const jwtPayload = jwt.verify(
              refreshToken,
              process.env.JWT_REFRESH_SECRET!
            ) as {
              id: string;
              username: string;
              email: string;
            };

            if (!jwtPayload?.id) {
              next();
            }

            const newAccessToken = jwt.sign(
              {
                id: jwtPayload.id,
                username: jwtPayload.username,
                email: jwtPayload.email,
              },
              process.env.JWT_ACCESS_SECRET!,
              { expiresIn: "1h" }
            );

            res.cookie("accessToken", newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 60 * 60 * 1000, // 15 minutes
            });

            return res.status(200).json(
              new SuccessResponse("User signed in using refresh token ", {
                user: {
                  id: jwtPayload.id,
                  username: jwtPayload.username,
                  email: jwtPayload.email,
                },
                tokens: { accessToken: newAccessToken },
              })
            );
          } catch (error) {
            throw new Error(`Error verifying refresh token ${error}`);
          }
        } else {
          next();
        }
      }
      next();
    }
  } else {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const jwtPayload = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!
        ) as {
          id: string;
          username: string;
          email: string;
        };

        if (!jwtPayload?.id) {
          next();
        }

        const newAccessToken = jwt.sign(
          {
            id: jwtPayload.id,
            username: jwtPayload.username,
            email: jwtPayload.email,
          },
          process.env.JWT_ACCESS_SECRET!,
          { expiresIn: "1h" }
        );

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 1000, // 15 minutes
        });

        return res.status(200).json(
          new SuccessResponse("User signed in using refresh token ", {
            user: {
              id: jwtPayload.id,
              username: jwtPayload.username,
              email: jwtPayload.email,
            },
            tokens: { accessToken: newAccessToken },
          })
        );
      } catch (error) {
        throw new Error(`Error verifying refresh token ${error}`);
      }
    } else {
      next();
    }
  }
};
