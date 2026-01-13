import z from "zod";
import { db } from "../../../../../server/db";
import { getSession } from "../../../../../server/better-auth/server";
import type { NextRequest } from "next/server";

// src/app/api/users/[id]/role/route.ts
const updateRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

// PUT /api/users/[id]/role
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
    const validated = updateRoleSchema.parse(body);

    // Prevent changing own role
    if (id === session.user.id) {
      return Response.json(
        { error: "Cannot change your own role" },
        { status: 400 },
      );
    }

    const user = await db.user.update({
      where: { id },
      data: { role: validated.role },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    return Response.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    console.error("PUT /api/users/[id]/role error:", error);
    return Response.json(
      { error: "Failed to update user role" },
      { status: 500 },
    );
  }
}
