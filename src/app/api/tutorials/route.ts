// ==========================================
// 🎥 TUTORIALS API ROUTES
// ==========================================

import type { NextRequest } from "next/server";
import z from "zod";
import { getSession } from "../../../server/better-auth/server";
import { db } from "../../../server/db";

// src/app/api/tutorials/route.ts
const createTutorialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  youtubeUrl: z.string().url("Invalid YouTube URL"),
  description: z.string().optional().nullable(),
});

// GET /api/tutorials
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutorials = await db.tutorial.findMany({
      include: {
        createdBy: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(tutorials);
  } catch (error) {
    //console..error("GET /api/tutorials error:", error);
    return Response.json(
      { error: "Failed to fetch tutorials" },
      { status: 500 },
    );
  }
}

// POST /api/tutorials
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = createTutorialSchema.parse(body);

    const tutorial = await db.tutorial.create({
      data: {
        ...validated,
        createdByUserId: session.user.id,
      },
      include: {
        createdBy: { select: { name: true, image: true } },
      },
    });

    return Response.json(tutorial, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    //console..error("POST /api/tutorials error:", error);
    return Response.json(
      { error: "Failed to create tutorial" },
      { status: 500 },
    );
  }
}
