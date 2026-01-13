// ==========================================
// 🎯 RECOMMENDATIONS API ROUTE
// ==========================================

import type { NextRequest } from "next/server";
import { getSession } from "../../../server/better-auth/server";
import { db } from "../../../server/db";

// src/app/api/recommendations/route.ts
// GET /api/recommendations
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's read books
    const readBooks = await db.userBook.findMany({
      where: {
        userId: session.user.id,
        shelf: "READ",
      },
      include: {
        book: { select: { genreId: true } },
      },
    });

    // Get user's ratings
    const userReviews = await db.review.findMany({
      where: { userId: session.user.id },
      select: { rating: true, bookId: true },
    });

    let recommendations: any[] = [];

    if (readBooks.length >= 3) {
      // Calculate genre preferences
      const genreCounts: Record<string, number> = {};
      readBooks.forEach((ub) => {
        genreCounts[ub.book.genreId] = (genreCounts[ub.book.genreId] || 0) + 1;
      });

      const topGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([genreId]) => genreId);

      // Get average user rating
      const avgUserRating =
        userReviews.length > 0
          ? userReviews.reduce((sum, r) => sum + r.rating, 0) /
            userReviews.length
          : 3;

      // Get books from preferred genres
      const readBookIds = readBooks.map((ub) => ub.bookId);

      recommendations = await db.book.findMany({
        where: {
          genreId: { in: topGenres },
          id: { notIn: readBookIds },
        },
        include: {
          genre: true,
          reviews: {
            where: { status: "APPROVED" },
            select: { rating: true },
          },
          _count: { select: { userBooks: true } },
        },
        take: 18,
      });

      // Calculate ratings and filter
      recommendations = recommendations
        .map((book) => {
          const avgRating =
            book.reviews.length > 0
              ? book.reviews.reduce(
                  (sum: any, r: { rating: any }) => sum + r.rating,
                  0,
                ) / book.reviews.length
              : 0;
          return { ...book, avgRating };
        })
        .filter((book) => book.avgRating >= avgUserRating - 1)
        .sort((a, b) => b.avgRating - a.avgRating);
    } else {
      // Fallback: popular books
      const allBooks = await db.book.findMany({
        include: {
          genre: true,
          reviews: {
            where: { status: "APPROVED" },
            select: { rating: true },
          },
          _count: { select: { userBooks: true } },
        },
        take: 30,
      });

      recommendations = allBooks
        .map((book) => {
          const avgRating =
            book.reviews.length > 0
              ? book.reviews.reduce((sum, r) => sum + r.rating, 0) /
                book.reviews.length
              : 0;
          return { ...book, avgRating };
        })
        .sort(
          (a, b) =>
            b.avgRating - a.avgRating ||
            b._count.userBooks - a._count.userBooks,
        )
        .slice(0, 18);
    }

    return Response.json(recommendations);
  } catch (error) {
    console.error("GET /api/recommendations error:", error);
    return Response.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 },
    );
  }
}
