// src/app/api/books/[id]/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { db } from "../../../../server/db";
import { getSession } from "../../../../server/better-auth/server";
import z from "zod";

const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(1, "Description is required"),
  coverUrl: z.string().url("Invalid cover URL"),
  totalPages: z.number().int().positive().optional().nullable(),
  genreId: z.string().min(1, "Genre is required"),
});
// GET /api/books/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const book = await db.book.findUnique({
      where: { id },
      include: {
        genre: true,
        createdBy: { select: { name: true, image: true } },
        reviews: {
          where: { status: "APPROVED" },
          include: {
            user: { select: { name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { userBooks: true } },
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const avgRating =
      book.reviews.length > 0
        ? book.reviews.reduce((sum, r) => sum + r.rating, 0) /
          book.reviews.length
        : 0;

    return NextResponse.json({ ...book, avgRating });
  } catch (error) {
    console.error("GET /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 },
    );
  }
}
// PUT /api/books/[id]
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
    const validated = createBookSchema.parse(body);

    const book = await db.book.update({
      where: { id },
      data: validated,
      include: {
        genre: true,
        createdBy: { select: { name: true, image: true } },
      },
    });

    return Response.json(book);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    console.error("PUT /api/books/[id] error:", error);
    return Response.json({ error: "Failed to update book" }, { status: 500 });
  }
}

// DELETE /api/books/[id]
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

    await db.book.delete({ where: { id } });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/books/[id] error:", error);
    return Response.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
