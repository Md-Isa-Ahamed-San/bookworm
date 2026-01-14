"use server";

import { db } from "~/server/db";
import { getSession } from "../server/better-auth/server";

export async function getUsers({
  search = "",
  role,
  page = 1,
  limit = 10,
}: {
  search?: string;
  role?: "USER" | "ADMIN";
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {},
      role ? { role } : {},
    ],
  };

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            createdBooks: true,
            reviews: true,
            userBooks: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUserDashboardData() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;

  // 1. Fetch User Data & Library in parallel
  const [currentReading, stats, recentReviews, userLibrary, userReviews] =
    await Promise.all([
      // Current reading book
      db.userBook.findFirst({
        where: { userId, shelf: "CURRENTLY_READING" },
        include: { book: { include: { genre: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      // Stats for the counter cards
      db.userBook.groupBy({
        by: ["shelf"],
        where: { userId },
        _count: true,
      }),
      // Recent reviews for the sidebar/list
      db.review.findMany({
        where: { userId },
        include: {
          book: { select: { id: true, title: true, coverUrl: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      // Full library to calculate genres and exclusions
      db.userBook.findMany({
        where: { userId },
        include: { book: { select: { genreId: true, id: true } } },
      }),
      // User's own ratings to determine their "taste"
      db.review.findMany({
        where: { userId },
        select: { rating: true },
      }),
    ]);

  // 2. Process Stats
  const booksReadCount = stats.find((s) => s.shelf === "READ")?._count ?? 0;
  const wantToRead = stats.find((s) => s.shelf === "WANT_TO_READ")?._count ?? 0;
  const currentlyReading =
    stats.find((s) => s.shelf === "CURRENTLY_READING")?._count ?? 0;

  const readBooks = userLibrary.filter((ub) => ub.shelf === "READ");
  const excludeBookIds = userLibrary.map((ub) => ub.bookId);

  let recommendationResults: any[] = [];

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

    const userAvgRating =
      userReviews.length > 0
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
      take: 30,
    });

    recommendationResults = candidates
      .map((book) => ({
        ...book,
        avgRating: calculateAvg(book.reviews),
      }))
      .filter((book) => book.avgRating >= Math.max(1, userAvgRating - 1.5))
      .sort((a, b) => b._count.userBooks - a._count.userBooks) // Sort by popularity
      .slice(0, 18);
  }

  // ---------------------------------------------------------
  // STRATEGY B: FALLBACK (Not enough history OR small DB)
  // ---------------------------------------------------------
  if (recommendationResults.length < 12) {
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

    const totalCount = await db.book.count();
    const randomBooks = await db.book.findMany({
      where: { id: { notIn: excludeBookIds } },
      include: {
        genre: true,
        reviews: { where: { status: "APPROVED" }, select: { rating: true } },
        _count: { select: { userBooks: true } },
      },
      skip: Math.max(0, Math.floor(Math.random() * (totalCount - 10))),
      take: 10,
    });

    const combined = [
      ...recommendationResults,
      ...popularBooks,
      ...randomBooks,
    ];
    const uniqueMap = new Map();
    combined.forEach((b) => uniqueMap.set(b.id, b));

    recommendationResults = Array.from(uniqueMap.values())
      .map((book) => ({
        ...book,
        avgRating: book.avgRating ?? calculateAvg(book.reviews),
      }))
      .sort(() => 0.5 - Math.random()) // Shuffle for variety
      .slice(0, 18);
  }

  // Clean up the reviews array before sending to client
  const finalRecommendations = recommendationResults.map(
    ({ reviews, ...rest }) => rest,
  );

  return {
    currentReading,
    stats: {
      booksRead: booksReadCount,
      wantToRead,
      currentlyReading,
      totalBooks: booksReadCount + wantToRead + currentlyReading,
    },
    recommendations: finalRecommendations,
    recentReviews,
    topGenreName: finalRecommendations[0]?.genre?.name ?? "Recommended",
  };
}

// Helper
function calculateAvg(reviews: { rating: number }[]) {
  if (!reviews || reviews.length === 0) return 0;
  return Number(
    (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
  );
}

/**
 * Get all tutorials
 */
export async function getAllTutorials() {
  const tutorials = await db.tutorial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return tutorials;
}
