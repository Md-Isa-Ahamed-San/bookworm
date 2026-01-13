"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { useGenres } from "../../../../../hooks/genre/use-genres"
import { useDeleteGenre } from "../../../../../hooks/genre/use-delete-genre"
import type { Genre } from "../../../../../../generated/prisma"
import { ConfirmationDialog } from "../../../../../components/confirmation-dialog"
import { EditGenreDialog } from "./edit-genre-dialog"
import { AddGenreDialog } from "./add-genre-dialog"

type GenreWithCount = Genre & {
  _count: {
    books: number
  }
}

export function GenresTable() {
  const { data: genres, isLoading, isError, error } = useGenres()
  const deleteGenre = useDeleteGenre()
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingGenre, setEditingGenre] = useState<GenreWithCount | null>(null)
  const [deletingGenre, setDeletingGenre] = useState<GenreWithCount | null>(null)

  const handleDelete = () => {
    if (deletingGenre) {
      deleteGenre.mutate(deletingGenre.id, {
        onSuccess: () => setDeletingGenre(null)
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <div className="p-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="bg-card border-border">
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-destructive font-medium mb-4">
              Failed to load genres
            </p>
            <p className="text-muted-foreground text-sm">
              {error?.message || "An unexpected error occurred"}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-card border-border">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-poppins font-bold text-foreground">
                All Genres
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {genres?.length || 0} genre(s) total
              </p>
            </div>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Genre
            </Button>
          </div>

          {/* Genres List */}
          {!genres || genres.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">No genres yet</p>
              <p className="text-muted-foreground text-sm mb-4">
                Get started by creating your first genre
              </p>
              <Button
                onClick={() => setIsAddOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Genre
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {genres.map((genre) => (
                <div
                  key={genre.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-poppins font-bold text-foreground truncate">
                      {genre.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {genre._count.books} book(s)
                    </p>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingGenre(genre)}
                      className="border-border hover:bg-accent hover:text-accent-foreground flex-1 sm:flex-none"
                      aria-label={`Edit ${genre.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeletingGenre(genre)}
                      className="border-border hover:bg-destructive hover:text-destructive-foreground flex-1 sm:flex-none"
                      aria-label={`Delete ${genre.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Dialogs */}
      <AddGenreDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      
      {editingGenre && (
        <EditGenreDialog
          genre={editingGenre}
          open={!!editingGenre}
          onOpenChange={(open) => !open && setEditingGenre(null)}
        />
      )}

      <ConfirmationDialog
        open={!!deletingGenre}
        onOpenChange={(open) => !open && setDeletingGenre(null)}
        onConfirm={handleDelete}
        title="Delete Genre"
        description={
          deletingGenre?._count.books
            ? `Cannot delete "${deletingGenre.name}" because it has ${deletingGenre._count.books} book(s). Please remove all books from this genre first.`
            : `Are you sure you want to delete "${deletingGenre?.name}"? This action cannot be undone.`
        }
        confirmText="Delete"
        isDestructive={true}
      />
    </>
  )
}