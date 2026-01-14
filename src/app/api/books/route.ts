// ==========================================
// 📚 BOOKS API ROUTES
// ==========================================
// src/app/api/books/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { getSession } from "../../../server/better-auth/server";

const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(1, "Description is required"),
  coverUrl: z.string().url("Invalid cover URL"),
  totalPages: z.number().int().positive().optional().nullable(),
  genreId: z.string().min(1, "Genre is required"),
});

// GET /api/books
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const genreIds = searchParams.get("genres")?.split(",").filter(Boolean);
    const minRating = searchParams.get("minRating");
    const maxRating = searchParams.get("maxRating");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ];
    }

    if (genreIds && genreIds.length > 0) {
      where.genreId = { in: genreIds };
    }

    let books = await db.book.findMany({
      where,
      include: {
        genre: true,
        createdBy: { select: { name: true, image: true } },
        reviews: {
          where: { status: "APPROVED" },
          select: { rating: true },
        },
        _count: { select: { userBooks: true } },
      },
      skip,
      take: limit,
      orderBy: sortBy === "mostShelved" ? undefined : { [sortBy]: "desc" },
    });

    books = books.map((book: any) => {
      const avgRating =
        book.reviews.length > 0
          ? book.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            book.reviews.length
          : 0;
      return { ...book, avgRating };
    });

    if (minRating || maxRating) {
      books = books.filter((book: any) => {
        const rating = book.avgRating;
        if (minRating && rating < parseFloat(minRating)) return false;
        if (maxRating && rating > parseFloat(maxRating)) return false;
        return true;
      });
    }

    if (sortBy === "rating") {
      books.sort((a: any, b: any) => b.avgRating - a.avgRating);
    } else if (sortBy === "mostShelved") {
      books.sort((a: any, b: any) => b._count.userBooks - a._count.userBooks);
    }

    const total = await db.book.count({ where });

    return Response.json({
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    //console..error("GET /api/books error:", error);
    return Response.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

// POST /api/books
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = createBookSchema.parse(body);

    const book = await db.book.create({
      data: {
        ...validated,
        createdByUserId: session.user.id,
      },
      include: {
        genre: true,
        createdBy: { select: { name: true, image: true } },
      },
    });

    return Response.json(book, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    //console..error("POST /api/books error:", error);
    return Response.json({ error: "Failed to create book" }, { status: 500 });
  }
}
