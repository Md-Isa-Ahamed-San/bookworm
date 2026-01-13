// ==========================================
// 👥 USERS (ADMIN) API ROUTES
// ==========================================

import type { NextRequest } from "next/server";
import { getSession } from "../../../server/better-auth/server";
import { db } from "../../../server/db";

// src/app/api/users/route.ts
// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role") as "USER" | "ADMIN" | null;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            userBooks: true,
            reviews: true,
            createdBooks: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
