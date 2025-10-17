// src/middlewares/errorHandler.ts

import { Request, Response, NextFunction } from "express";

// Optionally, define a custom error class for application errors
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Centralized error handler middleware
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Default values
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Optionally, log errors (replace with your logger if needed)
  if (process.env.NODE_ENV !== "test") {
    // Only log for non-test environments (customize as needed)
    console.error(`[${req.method}] ${req.originalUrl}:`, err);
  }

  res.status(status).json({
    success: false,
    status,
    message,
    // Only expose stack in dev for debugging (never in production)
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
