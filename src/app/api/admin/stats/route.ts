// ==========================================
// 📊 ADMIN STATS API ROUTE
// ==========================================

import { NextResponse, type NextRequest } from "next/server";
import { db } from "../../../../server/db";
import { getSession } from "../../../../server/better-auth/server";

// src/app/api/admin/stats/route.ts
// GET /api/admin/stats
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalUsers,
      totalBooks,
      totalGenres,
      totalReviews,
      pendingReviews,
      totalUserBooks,
      adminUsers,
    ] = await Promise.all([
      db.user.count(),
      db.book.count(),
      db.genre.count(),
      db.review.count(),
      db.review.count({ where: { status: "PENDING" } }),
      db.userBook.count(),
      db.user.count({ where: { role: "ADMIN" } }),
    ]);

    // Books per genre
    const booksPerGenre = await db.genre.findMany({
      include: {
        _count: { select: { books: true } },
      },
      orderBy: {
        books: {
          _count: "desc",
        },
      },
      take: 10,
    });

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await db.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    // Most shelved books
    const mostShelvedBooks = await db.book.findMany({
      include: {
        _count: { select: { userBooks: true } },
        genre: { select: { name: true } },
      },
      orderBy: {
        userBooks: {
          _count: "desc",
        },
      },
      take: 10,
    });

    // Average rating per book
    const booksWithReviews = await db.book.findMany({
      where: {
        reviews: {
          some: { status: "APPROVED" },
        },
      },
      include: {
        reviews: {
          where: { status: "APPROVED" },
          select: { rating: true },
        },
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    const avgRatings = booksWithReviews.map((book) => ({
      bookId: book.id,
      title: book.title,
      avgRating:
        book.reviews.reduce((sum, r) => sum + r.rating, 0) /
        book.reviews.length,
    }));

    return NextResponse.json({
      overview: {
        totalUsers,
        totalBooks,
        totalGenres,
        totalReviews,
        pendingReviews,
        totalUserBooks,
        adminUsers,
        recentUsers,
      },
      booksPerGenre: booksPerGenre.map((g) => ({
        name: g.name,
        count: g._count.books,
      })),
      mostShelvedBooks: mostShelvedBooks.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        genre: b.genre.name,
        shelvedCount: b._count.userBooks,
      })),
      topRatedBooks: avgRatings
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 10),
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 },
    );
  }
}
