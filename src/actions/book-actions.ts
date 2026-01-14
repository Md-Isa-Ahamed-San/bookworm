"use server"

import { revalidatePath } from "next/cache"
import { db } from "~/server/db"
import { getSession } from "../server/better-auth/server"


interface BookInput {
  title: string
  author: string
  description: string
  coverUrl: string
  totalPages?: number | null
  genreId: string
}

export async function createBook(data: BookInput) {
  try {
    const session = await getSession()
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    const book = await db.book.create({
      data: {
        ...data,
        createdByUserId: session.user.id,
      },
      include: { genre: true },
    })

    revalidatePath("/admin/books")
    return { success: true, data: book }
  } catch (error) {
    console.error("Error creating book:", error)
    return { success: false, error: "Failed to create book" }
  }
}

export async function updateBook(id: string, data: BookInput) {
  try {
    const session = await getSession()
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    const book = await db.book.update({
      where: { id },
      data,
      include: { genre: true },
    })

    revalidatePath("/admin/books")
    return { success: true, data: book }
  } catch (error) {
    console.error("Error updating book:", error)
    return { success: false, error: "Failed to update book" }
  }
}

export async function deleteBook(id: string) {
  try {
    const session = await getSession()
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    // Check if book has user books or reviews
    const book = await db.book.findUnique({
      where: { id },
      include: {
        _count: { select: { userBooks: true, reviews: true } },
      },
    })

    if (!book) {
      return { success: false, error: "Book not found" }
    }

    const totalRelations = book._count.userBooks + book._count.reviews

    if (totalRelations > 0) {
      return {
        success: false,
        error: `Cannot delete book with ${totalRelations} user interaction(s). Remove all shelves and reviews first.`,
      }
    }

    await db.book.delete({ where: { id } })

    revalidatePath("/admin/books")
    return { success: true }
  } catch (error) {
    console.error("Error deleting book:", error)
    return { success: false, error: "Failed to delete book" }
  }
}