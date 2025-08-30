import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.ts"; // Your extended Request type
import { asyncHandler } from "../utils/asyncHandler.ts";
import { SuccessResponse } from "../utils/apiSuccessResponse.ts";
import { ErrorResponse } from "../utils/apiErrorResponse.ts";
import z from "zod";
import { snippetsTable } from "../models/snippets.model.ts";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const createSnippetSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  markdown: z.string().min(1, "Markdown content is required").max(5000),
  description: z.string().max(1000).optional(),
});

export const createSnippet = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Validate snippet data from body
    const parsed = createSnippetSchema.safeParse(req.body);

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

    // Extract userId from decoded JWT payload attached by middleware
    // Assume payload includes 'id' as userId
    const userPayload = req.user as { id?: number };

    console.log(`Decoded JWT payload: ${userPayload}`);

    if (!userPayload?.id) {
      return res
        .status(401)
        .json(new ErrorResponse("AUTH_ERROR", "User ID missing in token"));
    }

    const userId = userPayload.id;
    const { title, markdown, description } = parsed.data;

    // Check duplicate title
    const existing = await db
      .select()
      .from(snippetsTable)
      .where(eq(snippetsTable.title, title))
      .limit(1);

    if (existing.length > 0) {
      return res
        .status(409)
        .json(
          new ErrorResponse("DUPLICATE_ERROR", "Snippet title already exists")
        );
    }

    // Insert snippet with userId from token
    const inserted = await db
      .insert(snippetsTable)
      .values({
        title,
        markdown,
        description,
        userId,
      })
      .returning({
        id: snippetsTable.id,
        title: snippetsTable.title,
        markdown: snippetsTable.markdown,
        description: snippetsTable.description,
        userId: snippetsTable.userId,
      });

    res.status(201).json(
      new SuccessResponse("Snippet created successfully", {
        snippet: inserted[0],
      })
    );
  }
);
