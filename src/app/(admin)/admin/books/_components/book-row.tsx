"use client"

import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import type { Book, Genre } from "../../../../../../generated/prisma"


type BookWithRelations = Book & {
  genre: Genre
  _count: {
    reviews: number
    userBooks: number
  }
}

interface BookRowProps {
  book: BookWithRelations
  onEdit: () => void
  onDelete: () => void
}

export function BookRow({ book, onEdit, onDelete }: BookRowProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
      {/* Book Cover */}
      <div className="relative w-14 h-20 flex-shrink-0 rounded overflow-hidden border border-border">
        <Image
          src={book.coverUrl}
          alt={book.title}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      {/* Book Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="font-poppins font-bold text-foreground truncate">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate">
          by {book.author}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-primary/10 text-primary rounded">
            {book.genre.name}
          </span>
          {book.totalPages && (
            <span>{book.totalPages} pages</span>
          )}
          <span>•</span>
          <span>{book._count.reviews} review(s)</span>
          <span>•</span>
          <span>{book._count.userBooks} shelved</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={onEdit}
          className="border-border hover:bg-accent hover:text-accent-foreground flex-1 sm:flex-none"
          aria-label={`Edit ${book.title}`}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onDelete}
          className="border-border hover:bg-destructive hover:text-destructive-foreground flex-1 sm:flex-none"
          aria-label={`Delete ${book.title}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}