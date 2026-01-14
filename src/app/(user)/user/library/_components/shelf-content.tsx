import { getUserBooks } from "~/queries/shelf-queries"
import { ShelfBookGrid } from "./shelf-book-grid" // 👈 Import the real grid
import { EmptyShelfState } from "./empty-shelf-state"
import type { ShelfType } from "../../../../../../generated/prisma"


interface ShelfContentProps {
  userId: string
  shelf: ShelfType
}

export async function ShelfContent({ shelf }: ShelfContentProps) {
  // Fetch data
  const books = await getUserBooks(shelf)

  // Show empty state if no books
  if (books.length === 0) {
    return <EmptyShelfState shelf={shelf} />
  }

  // 👈 FIX: Use ShelfBookGrid (not Skeleton) to render data
  return <ShelfBookGrid books={books} shelf={shelf} />
}