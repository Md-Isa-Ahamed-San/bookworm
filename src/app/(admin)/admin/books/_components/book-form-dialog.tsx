"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import { ImageUpload } from "./image-upload"
import { useCreateBook } from "../../../../../hooks/books/use-create-book"
import { useUpdateBook } from "../../../../../hooks/books/use-update-book"
import type { Book, Genre } from "../../../../../../generated/prisma"


const bookSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  author: z.string()
    .min(1, "Author is required")
    .max(100, "Author must be less than 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  coverUrl: z.string().url("Please upload a book cover"),
  totalPages: z.coerce.number()
    .int("Must be a whole number")
    .positive("Must be positive")
    .optional()
    .nullable()
    .transform(val => val === 0 ? null : val),
  genreId: z.string().min(1, "Genre is required"),
})

type BookFormData = z.infer<typeof bookSchema>

interface BookFormDialogProps {
  book?: Book & { genre: Genre }
  open: boolean
  onOpenChange: (open: boolean) => void
  genres: Genre[]
}

export function BookFormDialog({
  book,
  open,
  onOpenChange,
  genres,
}: BookFormDialogProps) {
  const isEditing = !!book
  const createBook = useCreateBook()
  const updateBook = useUpdateBook()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: book
      ? {
          title: book.title,
          author: book.author,
          description: book.description,
          coverUrl: book.coverUrl,
          totalPages: book.totalPages,
          genreId: book.genreId,
        }
      : {
          title: "",
          author: "",
          description: "",
          coverUrl: "",
          totalPages: null,
          genreId: "",
        },
  })

  const coverUrl = watch("coverUrl")

  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        author: book.author,
        description: book.description,
        coverUrl: book.coverUrl,
        totalPages: book.totalPages,
        genreId: book.genreId,
      })
    }
  }, [book, reset])

  const onSubmit = (data: BookFormData) => {
    if (isEditing) {
      updateBook.mutate(
        { id: book.id, data },
        {
          onSuccess: (result) => {
            if (result.success) {
              reset()
              onOpenChange(false)
            }
          },
        }
      )
    } else {
      createBook.mutate(data, {
        onSuccess: (result) => {
          if (result.success) {
            reset()
            onOpenChange(false)
          }
        },
      })
    }
  }

  const handleClose = () => {
    if (!createBook.isPending && !updateBook.isPending) {
      reset()
      onOpenChange(false)
    }
  }

  const isPending = createBook.isPending || updateBook.isPending

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-foreground">
            {isEditing ? "Edit Book" : "Add New Book"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? "Update the book information"
              : "Fill in the details to add a new book"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <ImageUpload
            value={coverUrl}
            onChange={(url) => setValue("coverUrl", url)}
            disabled={isPending}
          />
          {errors.coverUrl && (
            <p className="text-sm text-destructive">{errors.coverUrl.message}</p>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-poppins font-bold text-foreground">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., The Great Gatsby"
              className="bg-input border-border text-foreground"
              {...register("title")}
              disabled={isPending}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author" className="font-poppins font-bold text-foreground">
              Author *
            </Label>
            <Input
              id="author"
              placeholder="e.g., F. Scott Fitzgerald"
              className="bg-input border-border text-foreground"
              {...register("author")}
              disabled={isPending}
            />
            {errors.author && (
              <p className="text-sm text-destructive">{errors.author.message}</p>
            )}
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre" className="font-poppins font-bold text-foreground">
              Genre *
            </Label>
            <Select
              value={watch("genreId")}
              onValueChange={(value) => setValue("genreId", value)}
              disabled={isPending}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.genreId && (
              <p className="text-sm text-destructive">{errors.genreId.message}</p>
            )}
          </div>

          {/* Total Pages */}
          <div className="space-y-2">
            <Label htmlFor="totalPages" className="font-poppins font-bold text-foreground">
              Total Pages
            </Label>
            <Input
              id="totalPages"
              type="number"
              placeholder="e.g., 320"
              className="bg-input border-border text-foreground"
              {...register("totalPages")}
              disabled={isPending}
            />
            {errors.totalPages && (
              <p className="text-sm text-destructive">{errors.totalPages.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-poppins font-bold text-foreground">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Enter a detailed description of the book..."
              rows={6}
              className="bg-input border-border text-foreground resize-none"
              {...register("description")}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="border-border w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              {isPending
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Book"
                  : "Create Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}