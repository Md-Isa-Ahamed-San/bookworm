"use server"

import { z } from "zod"
import { db } from "~/server/db"

import { revalidatePath } from "next/cache"
import { ShelfType } from "../../generated/prisma"
import { getSession } from "../server/better-auth/server"


const shelfSchema = z.object({
  bookId: z.string(),
  shelf: z.nativeEnum(ShelfType),
})

export async function updateBookShelf(input: z.infer<typeof shelfSchema>) {
  const session = await getSession()
  if (!session) return { success: false, error: "Unauthorized" }

  const { bookId, shelf } = shelfSchema.parse(input)

  try {
    // Upsert: Create if doesn't exist, Update if it does
    await db.userBook.upsert({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId,
        },
      },
      update: { shelf },
      create: {
        userId: session.user.id,
        bookId,
        shelf,
      },
    })

    revalidatePath(`/books/${bookId}`)
    revalidatePath("/library")
    return { success: true }
  } catch (error) {
    console.error("Shelf update error:", error)
    return { success: false, error: "Failed to update shelf" }
  }
}