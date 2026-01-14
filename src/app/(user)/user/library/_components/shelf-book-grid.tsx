import type { ShelfType } from "../../../../../../generated/prisma"
import { ShelfBookCard } from "./shelf-book-card"

interface ShelfBookGridProps {
  books: any[] // The array returned from getUserBooks
  shelf: ShelfType
}

export function ShelfBookGrid({ books, shelf }: ShelfBookGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((userBook) => (
        <ShelfBookCard 
          key={userBook.id} 
          userBook={userBook} 
          shelf={shelf} 
        />
      ))}
    </div>
  )
}