// src/queries/admin-queries.ts
import { db } from "~/server/db" 

export type AdminStats = {
  counts: {
    books: number
    users: number
    pendingReviews: number
    genres: number
  }
  booksPerGenre: {
    name: string
    count: number
  }[]
  recentReviews: {
    id: string
    bookTitle: string
    userName: string
    rating: number
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: Date
  }[]
}

export async function getAdminStats(): Promise<AdminStats> {
  const [bookCount, userCount, pendingReviewCount, genreCount, genreData, recentReviews] = await Promise.all([
    db.book.count(),
    db.user.count(),
    db.review.count({ where: { status: "PENDING" } }),
    db.genre.count(),
    db.genre.findMany({
      include: {
        _count: {
          select: { books: true },
        },
      },
      take: 10, 
    }),
    db.review.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        book: { select: { title: true } },
      },
    }),
  ])

  return {
    counts: {
      books: bookCount,
      users: userCount,
      pendingReviews: pendingReviewCount,
      genres: genreCount,
    },
    booksPerGenre: genreData.map((g) => ({
      name: g.name,
      count: g._count.books,
    })),
    recentReviews: recentReviews.map((r) => ({
      id: r.id,
      bookTitle: r.book.title,
      userName: r.user.name || "Anonymous",
      rating: r.rating,
      status: r.status as "PENDING" | "APPROVED" | "REJECTED",
      createdAt: r.createdAt,
    })),
  }
}