import { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ErrorResponse } from "../utils/apiErrorResponse";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { snippetsTable } from "../models/snippets.model";
import { and, asc, desc, eq, lt, or, gt, sql } from "drizzle-orm";
import { commentInsertionType, commentsTable } from "../models/comments.model";
import { AuthRequest } from "../middlewares/authMiddleware";
import z from "zod";
import { SuccessResponse } from "../utils/apiSuccessResponse";
import { usersTable } from "../models/user.model";

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sqlClient });

const commentsSchema = z.object({
  comment: z
    .string()
    .max(300, "maxium limit reached for comments")
    .min(1, "minium 1 character required"),
});

export const postComments = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req?.user?.id;

    if (!userId) {
      return res
        .status(409)
        .json(new ErrorResponse("UNAUTHORIZED_ACCESS", "user not logged in"));
    }

    const snippetId = req.params.snippetId;

    if (!snippetId) {
      return res
        .status(409)
        .json(new ErrorResponse("VALIDATION_ERROR", "snippet id not provided"));
    }

    const castedSnippetId = parseInt(snippetId);

    const snippetExits = await db
      .select()
      .from(snippetsTable)
      .where(eq(snippetsTable.id, castedSnippetId));

    if (snippetExits.length <= 0) {
      return res
        .status(409)
        .json(
          new ErrorResponse(
            "VALIDATION_ERROR",
            `no snippet found with this snippet id : ${castedSnippetId}`
          )
        );
    }

    const body = req.body;

    const parsedResult = commentsSchema.safeParse(body);

    if (parsedResult.error) {
      return res
        .status(409)
        .json(
          new ErrorResponse(
            "VALIDATION_ERROR",
            ` ${parsedResult.error.issues[0].message}`
          )
        );
    }

    const commentValues: commentInsertionType = {
      comment: parsedResult.data.comment,
      snippetId: castedSnippetId,
      commentedBy: userId,
    };

    try {
      await db.insert(commentsTable).values(commentValues);
    } catch (error) {
      throw new Error(`${error}`);
    }

    return res.status(201).json(new SuccessResponse("comment posted", null));
  }
);

export const paginateComments = asyncHandler(
  async (req: Request, res: Response) => {
    const snippetId = req.params.snippetId;
    if (!snippetId) {
      return res
        .status(409)
        .json(new ErrorResponse("VALIDATION_ERROR", "snippet id not provided"));
    }
    const { limit, cursorId, orderby } = req.query;

    const limitNum = limit ? parseInt(limit as string) : 10;
    const cursorIdNum = cursorId ? parseInt(cursorId as string) : undefined;

    const orderByColumns =
      orderby === "asc"
        ? [asc(commentsTable.createdAt), asc(commentsTable.id)]
        : [desc(commentsTable.createdAt), desc(commentsTable.id)];
    // Fetch one extra record to determine if there's a next page
    const fetchLimit = limitNum + 1;

    const castedSnippetId = parseInt(snippetId);

    // cache it
    if (!cursorId) {
      const snippetExits = await db
        .select()
        .from(snippetsTable)
        .where(eq(snippetsTable.id, castedSnippetId));

      if (snippetExits.length <= 0) {
        return res
          .status(409)
          .json(
            new ErrorResponse(
              "VALIDATION_ERROR",
              `no snippet found with this snippet id : ${castedSnippetId}`
            )
          );
      }
    }

    let whereCondition;

    if (cursorIdNum) {
      whereCondition = and(
        eq(commentsTable.snippetId, castedSnippetId),
        orderby === "asc"
          ? gt(commentsTable.id, cursorIdNum)
          : lt(commentsTable.id, cursorIdNum)
      );
    } else {
      whereCondition = eq(commentsTable.snippetId, castedSnippetId);
    }

    const resultsWithExtra = await db
      .select({
        id: commentsTable.id,
        comment: commentsTable.comment,
        commentedBy: commentsTable.commentedBy,
        commentedOn: commentsTable.snippetId,
        username: usersTable.username,
        userAvatar: usersTable.avatarUrl,
      })
      .from(commentsTable)
      .leftJoin(usersTable, eq(commentsTable.commentedBy, usersTable.id))
      .where(whereCondition)
      .limit(fetchLimit)
      .orderBy(...orderByColumns);

    // Check if there are more records
    const hasNextPage = resultsWithExtra.length === fetchLimit;

    // Remove the extra record if it exists
    const paginatedResult = hasNextPage
      ? resultsWithExtra.slice(0, -1)
      : resultsWithExtra;

    const totalComments = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(commentsTable)
      .where(eq(commentsTable.snippetId, castedSnippetId));

    const responseData = {
      totalComments: totalComments[0].count,
      comments: paginatedResult,
      nextCursor:
        hasNextPage && paginatedResult.length > 0
          ? {
              cursorId: paginatedResult[paginatedResult.length - 1].id,
            }
          : null,
      hasNextPage,
      limit: limitNum,
    };

    return res
      .status(200)
      .json(
        new SuccessResponse("comments retrieved successfully", responseData)
      );
  }
);
