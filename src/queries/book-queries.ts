"use server"

import { db } from "~/server/db"

export interface BookFilters {
  search?: string
  genreIds?: string[]
  page?: number
  limit?: number
}

export async function getAllBooks(filters: BookFilters = {}) {
  try {
    const { search, genreIds, page = 1, limit = 4 } = filters
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ]
    }

    if (genreIds && genreIds.length > 0) {
      where.genreId = { in: genreIds }
    }

    const [books, total] = await Promise.all([
      db.book.findMany({
        where,
        include: {
          genre: true,
          createdBy: { select: { name: true, image: true } },
          _count: { select: { reviews: true, userBooks: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.book.count({ where }),
    ])

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Error fetching books:", error)
    throw new Error("Failed to fetch books")
  }
}

export async function getBookById(id: string) {
  try {
    const book = await db.book.findUnique({
      where: { id },
      include: {
        genre: true,
        createdBy: { select: { name: true } },
      },
    })
    return book
  } catch (error) {
    console.error("Error fetching book:", error)
    throw new Error("Failed to fetch book")
  }
}