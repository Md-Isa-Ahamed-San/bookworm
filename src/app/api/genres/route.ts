// ==========================================
// 🏷️ GENRES API ROUTES
// ==========================================

import type { NextRequest } from "next/server";
import z from "zod";
import { getSession } from "../../../server/better-auth/server";
import { db } from "../../../server/db";

// src/app/api/genres/route.ts
const createGenreSchema = z.object({
  name: z.string().min(1, "Genre name is required"),
});

// GET /api/genres
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const genres = await db.genre.findMany({
      include: {
        _count: { select: { books: true } },
      },
      orderBy: { name: "asc" },
    });

    return Response.json(genres);
  } catch (error) {
    //console..error("GET /api/genres error:", error);
    return Response.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
}

// POST /api/genres
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = createGenreSchema.parse(body);

    const genre = await db.genre.create({
      data: validated,
    });

    return Response.json(genre, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    //console..error("POST /api/genres error:", error);
    return Response.json({ error: "Failed to create genre" }, { status: 500 });
  }
}
