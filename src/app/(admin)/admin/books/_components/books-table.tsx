"use client"

import { useState } from "react"
import { Plus, Search, X, Loader2 } from "lucide-react" // Added Loader2
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import type { Book, Genre } from "../../../../../../generated/prisma"
import { PaginationControls } from "./pagination-controls"
import { BookRow } from "./book-row"
import { ConfirmationDialog } from "../../../../../components/confirmation-dialog"
import { BookFormDialog } from "./book-form-dialog"
import { GenreFilter } from "./genre-filter"
import { useDebouncedValue } from "../../../../../hooks/books/use-debounced-value"
import { useBooks } from "../../../../../hooks/books/use-books"
import { useGenres } from "../../../../../hooks/genre/use-genres"
import { useDeleteBook } from "../../../../../hooks/books/use-delete-book"

type BookWithRelations = Book & {
  genre: Genre
  _count: {
    reviews: number
    userBooks: number
  }
}

export function BooksTable() {
  const [search, setSearch] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<BookWithRelations | null>(null)
  const [deletingBook, setDeletingBook] = useState<BookWithRelations | null>(null)

  const debouncedSearch = useDebouncedValue(search, 300)
  
  const { data: booksData, isLoading, isFetching, isError, error } = useBooks({
    search: debouncedSearch,
    genreIds: selectedGenres,
    page,
    limit: 10,
  })

  const { data: genres } = useGenres()
  const deleteBook = useDeleteBook()

  const handleDelete = () => {
    if (deletingBook) {
      deleteBook.mutate(deletingBook.id, {
        onSuccess: () => setDeletingBook(null)
      })
    }
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedGenres([])
    setPage(1)
  }

  const hasFilters = search || selectedGenres.length > 0
  const { books, pagination } = booksData || { books: [], pagination: null }

  return (
    <>
      <Card className="bg-card border-border">
        <div className="p-4 sm:p-6">
          {/* Header - ALWAYS VISIBLE */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-poppins font-bold text-foreground">
                All Books
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {pagination?.total || 0} book(s) total
              </p>
            </div>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </div>

          {/* Filters - ALWAYS VISIBLE */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or author..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-input border-border"
                />
              </div>
              
              <GenreFilter
                genres={genres || []}
                selectedGenres={selectedGenres}
                onSelectedGenresChange={setSelectedGenres}
              />
            </div>

            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="border-border"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
           
          {/* Results Area - Loading logic moved here */}
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground text-sm">Loading books...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 border border-dashed border-destructive/50 rounded-lg">
              <p className="text-destructive font-medium mb-2">Failed to load books</p>
              <p className="text-muted-foreground text-sm">{error?.message}</p>
            </div>
          ) : !books || books.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-foreground font-medium mb-2">
                {hasFilters ? "No books found" : "No books yet"}
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                {hasFilters 
                  ? "Try adjusting your filters" 
                  : "Get started by adding your first book"}
              </p>
            </div>
          ) : (
            <div className={`space-y-3 transition-opacity ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
              {books.map((book) => (
                <BookRow
                  key={book.id}
                  book={book}
                  onEdit={() => setEditingBook(book)}
                  onDelete={() => setDeletingBook(book)}
                />
              ))}

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6">
                  <PaginationControls
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Dialogs remain the same */}
      <BookFormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        genres={genres || []}
      />

      {editingBook && (
        <BookFormDialog
          book={editingBook}
          open={!!editingBook}
          onOpenChange={(open) => !open && setEditingBook(null)}
          genres={genres || []}
        />
      )}

      <ConfirmationDialog
        open={!!deletingBook}
        onOpenChange={(open) => !open && setDeletingBook(null)}
        onConfirm={handleDelete}
        title="Delete Book"
        description={
          deletingBook
            ? `Are you sure you want to delete "${deletingBook.title}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        isDestructive={true}
      />
    </>
  )
}