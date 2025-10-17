import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

console.log(process.env.NODE_ENV);

// routes imports
import UserRoutes from "./routes/user.routes";
import SnippetsRoutes from "./routes/snippets.routes";
import COmmentRoutes from "./routes/comments.routes";
import { errorHandler } from "./middlewares/errorHandler";

// Load environment variables

const app = express();

const port = process.env.PORT! || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "healthy" });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to QuickSnippets " });
});

app.use("/api/users", UserRoutes);
app.use("/api/snippets", SnippetsRoutes);
app.use("/api/comment", COmmentRoutes);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
