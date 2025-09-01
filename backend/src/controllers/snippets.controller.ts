import { Response, Request } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.ts"; // Your extended Request type
import { asyncHandler } from "../utils/asyncHandler.ts";
import { SuccessResponse } from "../utils/apiSuccessResponse.ts";
import { ErrorResponse } from "../utils/apiErrorResponse.ts";
import z from "zod";
import { snippetsTable } from "../models/snippets.model.ts";
import { and, asc, desc, eq, gt, ilike, or, sql } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { usersTable } from "../models/user.model.ts";

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sqlClient });

const createSnippetSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  markdown: z.string().min(1, "Markdown content is required").max(5000),
  description: z.string().max(1000).optional(),
});

const updateSnippetSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  markdown: z
    .string()
    .min(1, "Markdown content is required")
    .max(5000)
    .optional(),
  description: z.string().max(1000).optional(),
  tags: z.string().max(500).optional(),
});

// Create a new snippet
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

// Update an existing snippet
export const updateSnippet = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Get snippet ID from URL params
    const snippetId = parseInt(req.params.id);

    if (!snippetId || isNaN(snippetId)) {
      return res
        .status(400)
        .json(new ErrorResponse("VALIDATION_ERROR", "Invalid snippet ID"));
    }

    // Validate update data from body
    const parsed = updateSnippetSchema.safeParse(req.body);

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

    // Extract userId from decoded JWT payload
    const userPayload = req.user as { id?: number };

    if (!userPayload?.id) {
      return res
        .status(401)
        .json(new ErrorResponse("AUTH_ERROR", "User ID missing in token"));
    }

    const userId = userPayload.id;
    const updateData = parsed.data;

    // Check if snippet exists and belongs to the user
    const existingSnippet = await db
      .select()
      .from(snippetsTable)
      .where(
        and(eq(snippetsTable.id, snippetId), eq(snippetsTable.userId, userId))
      )
      .limit(1);

    if (existingSnippet.length === 0) {
      return res
        .status(404)
        .json(
          new ErrorResponse("NOT_FOUND", "Snippet not found or unauthorized")
        );
    }

    // Check for duplicate title if title is being updated
    if (updateData.title && updateData.title !== existingSnippet[0].title) {
      const duplicateTitle = await db
        .select()
        .from(snippetsTable)
        .where(eq(snippetsTable.title, updateData.title))
        .limit(1);

      if (duplicateTitle.length > 0) {
        return res
          .status(409)
          .json(
            new ErrorResponse("DUPLICATE_ERROR", "Snippet title already exists")
          );
      }
    }

    // Update snippet
    const updated = await db
      .update(snippetsTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(
        and(eq(snippetsTable.id, snippetId), eq(snippetsTable.userId, userId))
      )
      .returning({
        id: snippetsTable.id,
        title: snippetsTable.title,
        markdown: snippetsTable.markdown,
        description: snippetsTable.description,
        tags: snippetsTable.tags,
        userId: snippetsTable.userId,
        createdAt: snippetsTable.createdAt,
        updatedAt: snippetsTable.updatedAt,
      });

    if (updated.length === 0) {
      return res
        .status(404)
        .json(
          new ErrorResponse("NOT_FOUND", "Snippet not found or unauthorized")
        );
    }

    res.status(200).json(
      new SuccessResponse("Snippet updated successfully", {
        snippet: updated[0],
      })
    );
  }
);

// Delete a snippet
export const deleteSnippet = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Get snippet ID from URL params
    const snippetId = parseInt(req.params.id);

    if (!snippetId || isNaN(snippetId)) {
      return res
        .status(400)
        .json(new ErrorResponse("VALIDATION_ERROR", "Invalid snippet ID"));
    }

    // Extract userId from decoded JWT payload
    const userPayload = req.user as { id?: number };

    if (!userPayload?.id) {
      return res
        .status(401)
        .json(new ErrorResponse("AUTH_ERROR", "User ID missing in token"));
    }

    const userId = userPayload.id;

    // Check if snippet exists and belongs to the user
    const existingSnippet = await db
      .select()
      .from(snippetsTable)
      .where(
        and(eq(snippetsTable.id, snippetId), eq(snippetsTable.userId, userId))
      )
      .limit(1);

    if (existingSnippet.length === 0) {
      return res
        .status(404)
        .json(
          new ErrorResponse("NOT_FOUND", "Snippet not found or unauthorized")
        );
    }

    // Delete snippet
    const deleted = await db
      .delete(snippetsTable)
      .where(
        and(eq(snippetsTable.id, snippetId), eq(snippetsTable.userId, userId))
      )
      .returning({
        id: snippetsTable.id,
        title: snippetsTable.title,
      });

    if (deleted.length === 0) {
      return res
        .status(404)
        .json(
          new ErrorResponse("NOT_FOUND", "Snippet not found or unauthorized")
        );
    }

    res.status(200).json(
      new SuccessResponse("Snippet deleted successfully", {
        deletedSnippet: deleted[0],
      })
    );
  }
);

// Get a snippet by ID
export const getSnippetById = asyncHandler(
  async (req: Request, res: Response) => {
    // Get snippet ID from URL params
    const snippetId = parseInt(req.params.id);

    if (!snippetId || isNaN(snippetId)) {
      return res
        .status(400)
        .json(new ErrorResponse("VALIDATION_ERROR", "Invalid snippet ID"));
    }

    try {
      // Fetch snippet by ID with user information using leftJoin
      const snippet = await db
        .select({
          id: snippetsTable.id,
          title: snippetsTable.title,
          markdown: snippetsTable.markdown,
          description: snippetsTable.description,
          tags: snippetsTable.tags,
          userId: snippetsTable.userId,
          createdAt: snippetsTable.createdAt,
          updatedAt: snippetsTable.updatedAt,
          // User fields
          username: usersTable.username,
          userAvatarUrl: usersTable.avatarUrl,
        })
        .from(snippetsTable)
        .leftJoin(usersTable, eq(snippetsTable.userId, usersTable.id))
        .where(eq(snippetsTable.id, snippetId))
        .limit(1);

      if (snippet.length === 0) {
        return res
          .status(404)
          .json(new ErrorResponse("NOT_FOUND", "Snippet not found"));
      }

      // Structure the response data
      const responseData = {
        id: snippet[0].id,
        title: snippet[0].title,
        markdown: snippet[0].markdown,
        description: snippet[0].description,
        tags: snippet[0].tags,
        userId: snippet[0].userId,
        createdAt: snippet[0].createdAt,
        updatedAt: snippet[0].updatedAt,
        user: {
          avatar: snippet[0].userAvatarUrl,
          username: snippet[0].username,
        },
      };

      res.status(200).json(
        new SuccessResponse("Snippet retrieved successfully", {
          snippet: responseData,
        })
      );
    } catch (error) {
      console.error("Database error:", error);
      return res
        .status(500)
        .json(
          new ErrorResponse(
            "DATABASE_ERROR",
            "An error occurred while fetching the snippet"
          )
        );
    }
  }
);

// Get random snippets with pagination
export const paginateRandomSnippets = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit, cursorId, cursorKey, orderby } = req.query;

    const limitNum = limit ? parseInt(limit as string) : 10;
    const cursorIdNum = cursorId ? parseInt(cursorId as string) : undefined;
    const cursorKeyStr = cursorKey && cursorKey.toString();

    const orderByColumns =
      orderby === "asc"
        ? [asc(snippetsTable.title), asc(snippetsTable.id)]
        : [desc(snippetsTable.title), desc(snippetsTable.id)];

    // Fetch one extra record to determine if there's a next page
    const fetchLimit = limitNum + 1;

    const resultsWithExtra = await db
      .select({
        snippetId: snippetsTable.id,
        snippetTitle: snippetsTable.title,
        snippetDescription: snippetsTable.description,
        trimmedSnippetMarkdownContent: sql`substring(${snippetsTable.markdown}, 1, 200)`,
        userId: snippetsTable.userId,
        username: usersTable.username,
        userAvatar: usersTable.avatarUrl,
      })
      .from(snippetsTable)
      .leftJoin(usersTable, eq(snippetsTable.userId, usersTable.id))
      .where(
        cursorId && cursorKey
          ? or(
              gt(snippetsTable.title, cursorKeyStr!),
              and(
                eq(snippetsTable.title, cursorKeyStr!),
                gt(snippetsTable.id, cursorIdNum!)
              )
            )
          : undefined
      )
      .limit(fetchLimit)
      .orderBy(...orderByColumns);

    // Check if there are more records
    const hasNextPage = resultsWithExtra.length === fetchLimit;

    // Remove the extra record if it exists
    const paginatedResult = hasNextPage
      ? resultsWithExtra.slice(0, -1)
      : resultsWithExtra;

    const totalSnippets = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(snippetsTable);

    const responseData = {
      totalSnippets: totalSnippets[0].count,
      snippets: paginatedResult,
      nextCursor:
        hasNextPage && paginatedResult.length > 0
          ? {
              cursorId: paginatedResult[paginatedResult.length - 1].snippetId,
              cursorKey:
                paginatedResult[paginatedResult.length - 1].snippetTitle,
            }
          : null,
      limit: limitNum,
    };

    return res
      .status(200)
      .json(
        new SuccessResponse(
          "Random snippets retrieved successfully",
          responseData
        )
      );
  }
);

export const searchSnippets = asyncHandler(
  async (req: Request, res: Response) => {
    // Get search query from query parameters
    const searchQuery = req.query.q as string;

    if (!searchQuery || searchQuery.trim().length === 0) {
      return res
        .status(400)
        .json(
          new ErrorResponse("VALIDATION_ERROR", "Search query is required")
        );
    }

    const trimmedQuery = searchQuery.trim();

    try {
      // Search snippets with title or description starting with the search query
      const searchResults = await db
        .select({
          snippetId: snippetsTable.id,
          snippetTitle: snippetsTable.title,
          snippetDescription: snippetsTable.description,
          trimmedSnippetMarkdownContent: sql<string>`substring(${snippetsTable.markdown}, 1, 200)`,
          userId: snippetsTable.userId,
          username: usersTable.username,
          userAvatar: usersTable.avatarUrl,
          createdAt: snippetsTable.createdAt,
        })
        .from(snippetsTable)
        .leftJoin(usersTable, eq(snippetsTable.userId, usersTable.id))
        .where(
          or(
            ilike(snippetsTable.title, `${trimmedQuery}%`),
            ilike(snippetsTable.description, `${trimmedQuery}%`)
          )
        )
        .orderBy(desc(snippetsTable.createdAt))
        .limit(20);

      // If no results found
      if (searchResults.length === 0) {
        return res.status(200).json(
          new SuccessResponse("No snippets found matching your search", {
            snippets: [],
            searchQuery: trimmedQuery,
            totalResults: 0,
          })
        );
      }

      res.status(200).json(
        new SuccessResponse("Search completed successfully", {
          snippets: searchResults,
          searchQuery: trimmedQuery,
          totalResults: searchResults.length,
        })
      );
    } catch (error) {
      console.error("Search error:", error);
      return res
        .status(500)
        .json(
          new ErrorResponse(
            "DATABASE_ERROR",
            "An error occurred while searching snippets"
          )
        );
    }
  }
);

// Get snippets by user ID with pagination
export const PaginateUserSnippets = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = parseInt(req.params.userId);
    const { limit, page, cursorId, cursorKey, orderby } = req.query;

    const limitNum = limit ? parseInt(limit as string) : 10;
    const cursorIdNum = cursorId ? parseInt(cursorId as string) : undefined;
    const cursorKeyStr = cursorKey && cursorKey.toString();

    const orderByColumns =
      orderby === "asc"
        ? [asc(snippetsTable.title), asc(snippetsTable.id)]
        : [desc(snippetsTable.title), desc(snippetsTable.id)];

    const fetchLimit = limitNum + 1;

    const resultsWithExtra = await db
      .select({
        snippetId: snippetsTable.id,
        snippetTitle: snippetsTable.title,
        snippetDescription: snippetsTable.description,
        trimmedSnippetMarkdownContent: sql`substring(${snippetsTable.markdown}, 1, 200)`,
        userId: snippetsTable.userId,
      })
      .from(snippetsTable)
      .where(
        cursorId && cursorKey
          ? or(
              gt(snippetsTable.title, cursorKey as string),
              and(
                eq(snippetsTable.title, cursorKey as string),
                eq(snippetsTable.userId, userId),
                cursorIdNum !== undefined
                  ? gt(snippetsTable.id, cursorIdNum)
                  : undefined
              )
            )
          : undefined
      )
      .limit(fetchLimit)
      .leftJoin(usersTable, eq(snippetsTable.userId, userId))
      .orderBy(...orderByColumns);

    const hasNextPage = resultsWithExtra.length === fetchLimit;

    // Remove the extra record if it exists
    const paginatedResult = hasNextPage
      ? resultsWithExtra.slice(0, -1)
      : resultsWithExtra;

    const totalSnippets = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(snippetsTable)
      .where(eq(snippetsTable.userId, userId));

    const responseData = {
      totalSnippets: totalSnippets[0].count,
      snippets: paginatedResult,
      nextCursor: paginatedResult.length
        ? {
            cursorId: paginatedResult[paginatedResult.length - 1].snippetId,
            cursorKey: paginatedResult[paginatedResult.length - 1].snippetTitle,
          }
        : null,
      limit: limitNum,
      page: page ? parseInt(page as string) : 1,
    };

    return res
      .status(200)
      .json(
        new SuccessResponse(
          "User snippets retrieved successfully",
          responseData
        )
      );
  }
);

// Get snippets of the authenticated user with pagination
export const paginateMySnippets = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json(new ErrorResponse("AUTH_ERROR", "User not authenticated"));
    }
    const { limit, page, cursorId, cursorKey, orderby } = req.query;

    const limitNum = limit ? parseInt(limit as string) : 10;
    const cursorIdNum = cursorId ? parseInt(cursorId as string) : undefined;
    const cursorKeyStr = cursorKey && cursorKey.toString();

    const orderByColumns =
      orderby === "asc"
        ? [asc(snippetsTable.title), asc(snippetsTable.id)]
        : [desc(snippetsTable.title), desc(snippetsTable.id)];

    const fetchLimit = limitNum + 1;

    const resultsWithExtra = await db
      .select({
        snippetId: snippetsTable.id,
        snippetTitle: snippetsTable.title,
        snippetDescription: snippetsTable.description,
        trimmedSnippetMarkdownContent: sql`substring(${snippetsTable.markdown}, 1, 200)`,
        userId: snippetsTable.userId,
        username: usersTable.username,
        userAvatar: usersTable.avatarUrl,
      })
      .from(snippetsTable)
      .where(
        cursorId && cursorKey
          ? or(
              gt(snippetsTable.title, cursorKey as string),
              and(
                eq(snippetsTable.title, cursorKey as string),
                eq(snippetsTable.userId, userId),
                cursorIdNum !== undefined
                  ? gt(snippetsTable.id, cursorIdNum)
                  : undefined
              )
            )
          : undefined
      )
      .limit(limitNum)
      .leftJoin(usersTable, eq(snippetsTable.userId, userId))
      .orderBy(...orderByColumns);

    const hasNextPage = resultsWithExtra.length === fetchLimit;

    // Remove the extra record if it exists
    const paginatedResult = hasNextPage
      ? resultsWithExtra.slice(0, -1)
      : resultsWithExtra;

    const totalSnippets = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(snippetsTable)
      .where(eq(snippetsTable.userId, userId));

    const responseData = {
      totalSnippets: totalSnippets[0].count,
      snippets: paginatedResult,
      nextCursor: paginatedResult.length
        ? {
            cursorId: paginatedResult[paginatedResult.length - 1].snippetId,
            cursorKey: paginatedResult[paginatedResult.length - 1].snippetTitle,
          }
        : null,
      limit: limitNum,
      page: page ? parseInt(page as string) : 1,
    };

    return res
      .status(200)
      .json(
        new SuccessResponse(
          "Random snippets retrieved successfully",
          responseData
        )
      );
  }
);

// Get snippets by tags with pagination
export const paginateSnippetsByTags = asyncHandler(
  async (req: Request, res: Response) => {
    const tagsQuery = req.query.tags as string;
    if (!tagsQuery || tagsQuery.trim().length === 0) {
      return res
        .status(400)
        .json(
          new ErrorResponse(
            "VALIDATION_ERROR",
            "Tags query parameter is required"
          )
        );
    }
    const tags = tagsQuery
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (tags.length === 0) {
      return res
        .status(400)
        .json(
          new ErrorResponse(
            "VALIDATION_ERROR",
            "At least one valid tag is required"
          )
        );
    }
    const { limit, page, cursorId, cursorKey, orderby } = req.query;

    const limitNum = limit ? parseInt(limit as string) : 10;
    const cursorIdNum = cursorId ? parseInt(cursorId as string) : undefined;
    const cursorKeyStr = cursorKey && cursorKey.toString();

    const orderByColumns =
      orderby === "asc"
        ? [asc(snippetsTable.title), asc(snippetsTable.id)]
        : [desc(snippetsTable.title), desc(snippetsTable.id)];

    const fetchLimit = limitNum + 1;

    const resultsWithExtra = await db
      .select({
        snippetId: snippetsTable.id,
        snippetTitle: snippetsTable.title,
        snippetDescription: snippetsTable.description,
        trimmedSnippetMarkdownContent: sql`substring(${snippetsTable.markdown}, 1, 200)`,
        userId: snippetsTable.userId,
        username: usersTable.username,
        userAvatar: usersTable.avatarUrl,
      })
      .from(snippetsTable)
      .where(
        cursorId && cursorKey
          ? or(
              gt(snippetsTable.title, cursorKey as string),
              and(
                eq(snippetsTable.title, cursorKey as string),
                or(...tags.map((tag) => ilike(snippetsTable.tags, `%${tag}%`))),
                cursorIdNum !== undefined
                  ? gt(snippetsTable.id, cursorIdNum)
                  : undefined
              )
            )
          : undefined
      )
      .limit(limitNum)
      .leftJoin(usersTable, eq(snippetsTable.userId, usersTable.id))
      .orderBy(...orderByColumns);

    const hasNextPage = resultsWithExtra.length === fetchLimit;

    // Remove the extra record if it exists
    const paginatedResult = hasNextPage
      ? resultsWithExtra.slice(0, -1)
      : resultsWithExtra;

    const totalSnippets = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(snippetsTable)
      .where(or(...tags.map((tag) => ilike(snippetsTable.tags, `%${tag}%`))));

    const responseData = {
      totalSnippets: totalSnippets[0].count,
      snippets: paginatedResult,
      nextCursor: paginatedResult.length
        ? {
            cursorId: paginatedResult[paginatedResult.length - 1].snippetId,
            cursorKey: paginatedResult[paginatedResult.length - 1].snippetTitle,
          }
        : null,
      limit: limitNum,
      page: page ? parseInt(page as string) : 1,
    };

    return res
      .status(200)
      .json(
        new SuccessResponse(
          "Random snippets retrieved successfully",
          responseData
        )
      );
  }
);

// Additional handlers for future features can be added here
