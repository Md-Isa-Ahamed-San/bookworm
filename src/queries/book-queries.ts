"use server";

import { db } from "~/server/db";
import { Prisma } from "../../generated/prisma";

export interface BookFilters {
  search?: string;
  genreIds?: string[];
  genreId?: string;
  sortBy?: "newest" | "rating" | "title";
  page?: number;
  limit?: number;
}

export async function getAllBooks(filters: BookFilters = {}) {
  try {
    const {
      search,
      genreIds,
      genreId,
      sortBy = "newest",
      page = 1,
      limit = 12,
    } = filters;

    const skip = (page - 1) * limit;

    // 1. Build Dynamic Where Clause .Tells TypeScript: "This object will eventually look like a Book filter"
    const where: Prisma.BookWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ];
    }

    if (genreIds && genreIds.length > 0) {
      where.genreId = { in: genreIds };
    } else if (genreId && genreId !== "all") {
      where.genreId = genreId;
    }

    // 2. Build Dynamic Order By
    // Use this type helper to be safe against Prisma version changes
    let orderBy: Prisma.BookFindManyArgs["orderBy"] = { createdAt: "desc" };

    if (sortBy === "title") {
      orderBy = { title: "asc" };
    } else if (sortBy === "rating") {
      orderBy = { reviews: { _count: "desc" } };
    }

    // 3. Fetch Data
    const [booksRaw, total] = await Promise.all([
      db.book.findMany({
        where,
        include: {
          genre: true,
          createdBy: { select: { name: true, image: true } },
          _count: { select: { reviews: true, userBooks: true } },
          reviews: {
            select: { rating: true },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      db.book.count({ where }),
    ]);

    // 4. Transform Data
    const books = booksRaw.map((book) => {
      const totalRating = book.reviews.reduce((acc, r) => acc + r.rating, 0);
      const avgRating =
        book.reviews.length > 0 ? totalRating / book.reviews.length : 0;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reviews, ...rest } = book;

      return {
        ...rest,
        avgRating,
      };
    });

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    //console..error("Error fetching books:", error);
    throw new Error("Failed to fetch books");
  }
}

export async function getBookById(id: string) {
  try {
    const book = await db.book.findUnique({
      where: { id },
      include: {
        genre: true,
        createdBy: { select: { name: true } },
        _count: { select: { reviews: true } },
        reviews: {
          select: { rating: true },
        },
      },
    });

    if (!book) return null;

    const totalRating = book.reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating =
      book.reviews.length > 0 ? totalRating / book.reviews.length : 0;

    return { ...book, avgRating };
  } catch (error) {
    //console..error("Error fetching book:", error);
    throw new Error("Failed to fetch book");
  }
}

export async function getGenres() {
  return db.genre.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { books: true } },
    },
  });
}
