import { getUserBooks } from "~/queries/shelf-queries"
import { ShelfBookGrid } from "./shelf-book-grid"
import { EmptyShelfState } from "./empty-shelf-state"
import type { ShelfType } from "../../../../../../generated/prisma"


interface ShelfContentProps {
  userId: string
  shelf: ShelfType
}

export async function ShelfContent({ userId, shelf }: ShelfContentProps) {
  // Fetch data using the userId
  const books = await getUserBooks(shelf)

  // Show empty state if no books
  if (books.length === 0) {
    return <EmptyShelfState shelf={shelf} />
  }

  // Render the actual book grid with data
  return <ShelfBookGrid books={books} shelf={shelf} />
}