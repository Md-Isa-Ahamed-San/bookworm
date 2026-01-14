"use client"

import { BookOpen } from "lucide-react"
import { Button } from "~/components/ui/button"

import Link from "next/link"
import type { ShelfType } from "../../../../../../generated/prisma"
import { ShelfBookCard } from "./shelf-book-card"


interface ShelfGridProps {
  books: any[]
  shelf: ShelfType
}

const emptyMessages = {
  WANT_TO_READ: {
    title: "No books on your reading list",
    description: "Browse our catalog and add books you want to read",
  },
  CURRENTLY_READING: {
    title: "You're not reading anything right now",
    description: "Start a new book from your want to read list or browse the catalog",
  },
  READ: {
    title: "You haven't finished any books yet",
    description: "Mark books as read to track your reading journey",
  },
}

export function ShelfGrid({ books, shelf }: ShelfGridProps) {
  if (books.length === 0) {
    const message = emptyMessages[shelf]
    
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-poppins font-bold text-foreground mb-2">
          {message.title}
        </h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {message.description}
        </p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/user/browse">Browse Books</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        {books.length} book{books.length !== 1 ? "s" : ""}
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {books.map((userBook) => (
          <ShelfBookCard
            key={userBook.id}
            userBook={userBook}
            shelf={shelf}
          />
        ))}
      </div>
    </div>
  )
}