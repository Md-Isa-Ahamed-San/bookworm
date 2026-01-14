// src/app/api/recommendations/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../server/better-auth/server";
import { db } from "../../../server/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Fetch User's Library & History
    const [userLibrary, userReviews] = await Promise.all([
      db.userBook.findMany({
        where: { userId },
        select: { bookId: true, shelf: true, book: { select: { genreId: true } } },
      }),
      db.review.findMany({
        where: { userId },
        select: { rating: true },
      }),
    ]);

    const excludeBookIds = userLibrary.map((ub) => ub.bookId);
    const readBooks = userLibrary.filter((ub) => ub.shelf === "READ");
    
    let recommendations: any[] = [];

    // ---------------------------------------------------------
    // STRATEGY A: PERSONALIZED (User has >= 3 Read Books)
    // ---------------------------------------------------------
    if (readBooks.length >= 3) {
      const genreCounts: Record<string, number> = {};
      readBooks.forEach((ub) => {
        const gid = ub.book.genreId;
        genreCounts[gid] = (genreCounts[gid] || 0) + 1;
      });

      const topGenreIds = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([id]) => id);

      const userAvgRating = userReviews.length > 0
          ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length
          : 3.0;

      const candidates = await db.book.findMany({
        where: {
          genreId: { in: topGenreIds },
          id: { notIn: excludeBookIds },
        },
        include: {
          genre: true,
          reviews: { where: { status: "APPROVED" }, select: { rating: true } },
          _count: { select: { userBooks: true } },
        },
        take: 40,
      });

      recommendations = candidates
        .map((book) => ({
          ...book,
          avgRating: calculateAverageRating(book.reviews),
        }))
        .filter((book) => book.avgRating >= Math.max(1, userAvgRating - 1.5))
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 18);
    }

    // ---------------------------------------------------------
    // STRATEGY B: FALLBACK (Not enough history OR not enough results)
    // ---------------------------------------------------------
    if (recommendations.length < 12) {
      // 1. Get Popular Books (Most shelved)
      const popularBooks = await db.book.findMany({
        where: { id: { notIn: excludeBookIds } },
        include: {
          genre: true,
          reviews: { where: { status: "APPROVED" }, select: { rating: true } },
          _count: { select: { userBooks: true } },
        },
        orderBy: { userBooks: { _count: "desc" } },
        take: 15,
      });

      // 2. Get Random Books (For discovery)
      const totalBooksCount = await db.book.count();
      // Ensure skip is safe even with small DBs
      const safeSkip = Math.max(0, Math.floor(Math.random() * (totalBooksCount - 10)));
      
      const randomBooks = await db.book.findMany({
        where: { id: { notIn: excludeBookIds } },
        include: {
          genre: true,
          reviews: { where: { status: "APPROVED" }, select: { rating: true } },
          _count: { select: { userBooks: true } },
        },
        skip: safeSkip,
        take: 10,
      });

      // Combine existing recommendations with popular and random
      const combined = [...recommendations, ...popularBooks, ...randomBooks];

      // Deduplicate by ID
      const uniqueMap = new Map();
      combined.forEach(book => uniqueMap.set(book.id, book));
      
      recommendations = Array.from(uniqueMap.values())
        .map((book) => ({
          ...book,
          avgRating: book.avgRating ?? calculateAverageRating(book.reviews),
        }))
        // Shuffle the fallback results so it's not always the same
        .sort(() => 0.5 - Math.random())
        .slice(0, 18);
    }

    // 3. Final Sanitization (Strictly remove the reviews array)
    const sanitized = recommendations.map((book) => {
      const { reviews, ...rest } = book;
      return rest;
    });

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error("GET /api/recommendations error:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}

function calculateAverageRating(reviews: { rating: number }[]) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
}