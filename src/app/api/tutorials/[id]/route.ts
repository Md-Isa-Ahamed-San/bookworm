// src/app/api/tutorials/[id]/route.ts

import z from "zod";
import { getSession } from "../../../../server/better-auth/server";
import type { NextRequest } from "next/server";
import { db } from "../../../../server/db";

const createTutorialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  youtubeUrl: z.string().url("Invalid YouTube URL"),
  description: z.string().optional().nullable(),
});

// GET /api/tutorials/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const tutorial = await db.tutorial.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true, image: true } },
      },
    });

    if (!tutorial) {
      return Response.json({ error: "Tutorial not found" }, { status: 404 });
    }

    return Response.json(tutorial);
  } catch (error) {
    console.error("GET /api/tutorials/[id] error:", error);
    return Response.json(
      { error: "Failed to fetch tutorial" },
      { status: 500 },
    );
  }
}

// PUT /api/tutorials/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = createTutorialSchema.parse(body);

    const tutorial = await db.tutorial.update({
      where: { id },
      data: validated,
      include: {
        createdBy: { select: { name: true, image: true } },
      },
    });

    return Response.json(tutorial);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    console.error("PUT /api/tutorials/[id] error:", error);
    return Response.json(
      { error: "Failed to update tutorial" },
      { status: 500 },
    );
  }
}

// DELETE /api/tutorials/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await db.tutorial.delete({ where: { id } });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tutorials/[id] error:", error);
    return Response.json(
      { error: "Failed to delete tutorial" },
      { status: 500 },
    );
  }
}
