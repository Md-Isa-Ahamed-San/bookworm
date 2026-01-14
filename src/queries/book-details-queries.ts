import { db } from "~/server/db"

export async function getBookDetails(id: string) {
  const book = await db.book.findUnique({
    where: { id },
    include: {
      genre: true,
      createdBy: { select: { name: true } },
      _count: { select: { reviews: true } },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, image: true } },
        },
      },
    },
  })

  if (!book) return null

  // Calculate average rating
  const totalRating = book.reviews.reduce((acc, r) => acc + r.rating, 0)
  const avgRating = book.reviews.length > 0 ? totalRating / book.reviews.length : 0

  return { ...book, avgRating }
}

export async function getUserBookStatus(userId: string, bookId: string) {
  const [userBook, userReview] = await Promise.all([
    db.userBook.findUnique({
      where: { userId_bookId: { userId, bookId } },
      select: { shelf: true },
    }),
    db.review.findUnique({
      where: { userId_bookId: { userId, bookId } },
      select: { id: true, status: true },
    }),
  ])

  return {
    shelf: userBook?.shelf || null,
    hasReviewed: !!userReview,
    reviewStatus: userReview?.status || null,
  }
}