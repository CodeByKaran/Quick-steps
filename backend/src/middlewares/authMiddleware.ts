import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface UserPayload {
  id: number;
  username: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

// Replace with your secret, use env for real projects
const SECRET_KEY = process.env.JWT_ACCESS_SECRET!;

export function AuthMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  console.log(`jwt secret: ${SECRET_KEY}`);

  const authHeader = req.headers.authorization || req.cookies?.accessToken;
  console.log(`Auth Header with bearer: ${req.headers.authorization}`);
  console.log(`Auth token from cookie: ${req.cookies?.accessToken}`);

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  let token;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "").trim();
  }

  if (
    !req.headers.authorization?.startsWith("Bearer ") &&
    req.cookies?.accessToken
  ) {
    token = authHeader.trim();
  }

  console.log(`Token: ${token}`);

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as UserPayload;
    req.user = decoded;
    next();
  } catch (err: unknown) {
    return res
      .status(403)
      .json({ message: "Invalid error occured while checking auth" });
  }
}
