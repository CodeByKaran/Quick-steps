import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { SuccessResponse } from "../utils/apiSuccessResponse";
import z, { set } from "zod";
import { ErrorResponse } from "../utils/apiErrorResponse";
import { usersTable } from "../models/user.model";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { AuthRequest } from "../middlewares/authMiddleware";
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const userSchema = z.object({
  username: z
    .string()
    .min(6, "Username must be at least 6 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be at most 100 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Generate JWT Tokens
export const generateAccessToken = (payload: object) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: "1h" });

export const generateRefreshToken = (payload: object) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

export const setAccessCookie = (res: Response, token: string) => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 60 * 60 * 1000, // 60 minutes
  });
};

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// User Signup controller
export const userSignup = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    return res
      .status(400)
      .json(
        new ErrorResponse(
          "VALIDATION_ERROR",
          `${parsed.error.issues[0].message}`
        )
      );
  }

  const { username, email, password } = parsed.data;

  // Hash the password before storing (replace with your hashing function)
  const passwordHash = bcrypt.hashSync(password, 10);

  const newUser = await db
    .insert(usersTable)
    .values({
      username,
      email,
      passwordHash,
    })
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
    });

  if (!newUser) {
    return res
      .status(500)
      .json(new ErrorResponse("DB_ERROR", "Failed to create user"));
  }

  // Your signup logic here
  res
    .status(201)
    .json(
      new SuccessResponse("User signed up successfully", { user: newUser[0] })
    );
});

//user Signin controller
export const userSignin = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const parsed = signinSchema.safeParse(body);

  if (!parsed.success) {
    return res
      .status(400)
      .json(
        new ErrorResponse(
          "VALIDATION_ERROR",
          `${parsed.error.issues[0].message}`
        )
      );
  }

  const { email, password } = parsed.data;

  // Find user by email
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user || user.length === 0) {
    return res
      .status(401)
      .json(new ErrorResponse("AUTH_ERROR", "Invalid email or password"));
  }

  const existingUser = user[0];
  const passwordMatch = bcrypt.compareSync(password, existingUser.passwordHash);

  if (!passwordMatch) {
    return res
      .status(401)
      .json(new ErrorResponse("AUTH_ERROR", "Invalid email or password"));
  }

  const payload = {
    id: existingUser.id,
    username: existingUser.username,
    email: existingUser.email,
  };

  console.log("is secure", process.env.NODE_ENV === "production");

  // Create tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Set access token cookie (short-lived)
  // res.cookie("accessToken", accessToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "none",
  //   maxAge: 60 * 60 * 1000, // 60 minutes
  // });

  setAccessCookie(res, accessToken);
  setRefreshCookie(res, refreshToken);

  // Set refresh token cookie (longer-lived)
  // res.cookie("refreshToken", refreshToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "none",
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // });

  res.status(200).json(
    new SuccessResponse("User signed in successfully", {
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
      },
      tokens: { accessToken },
    })
  );
});

//user Signout controller
export const userSignout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res
    .status(200)
    .json(new SuccessResponse("User logged out successfully", null));
});

//user Delete controller
export const userDeletAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { username } = req.body;
    if (!username) {
      return res
        .status(400)
        .json(new ErrorResponse("VALIDATION_ERROR", "Username is required"));
    }

    if (!req.user || !req.user.username) {
      return res
        .status(401)
        .json(new ErrorResponse("AUTH_ERROR", "Unauthorized"));
    }

    if (req.user.username !== username) {
      return res
        .status(403)
        .json(
          new ErrorResponse(
            "AUTH_ERROR",
            "You can only delete your own account"
          )
        );
    }

    // Step 1: Select user details
    const userExists = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        avatarUrl: usersTable.avatarUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (userExists.length === 0) {
      return res
        .status(404)
        .json(new ErrorResponse("NOT_FOUND", "User not found"));
    }

    // Step 2: Delete user without returning
    await db.delete(usersTable).where(eq(usersTable.username, username));

    // Respond with the user data retrieved before deletion
    return res.status(200).json(
      new SuccessResponse("User account deleted successfully", {
        user: userExists[0],
      })
    );
  }
);

// Token refresh endpoint
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(401)
        .json(new ErrorResponse("AUTH_ERROR", "Refresh token missing"));
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as {
        id: string;
        username: string;
        email: string;
      };

      const newAccessToken = generateAccessToken({
        id: payload.id,
        username: payload.username,
        email: payload.email,
      });

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 15 minutes
      });

      res.status(200).json(new SuccessResponse("Access token refreshed", null));
    } catch (err) {
      return res
        .status(401)
        .json(new ErrorResponse("AUTH_ERROR", "Invalid refresh token"));
    }
  }
);

export const isUserSignedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  console.log("is secure", process.env.NODE_ENV === "production");
  if (!token) {
    console.log("no token found in cookies");

    return res.status(401).json({ success: false, message: "Not signed in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    // If needed, attach user info to request object
    return res
      .status(200)
      .json({ success: true, message: "User is signed in", user: decoded });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
