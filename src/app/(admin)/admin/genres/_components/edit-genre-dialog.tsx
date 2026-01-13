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
import type { Genre } from "../../../../../../generated/prisma"
import { useUpdateGenre } from "../../../../../hooks/genre/use-update-genre"


const genreSchema = z.object({
  name: z.string()
    .min(2, "Genre name must be at least 2 characters")
    .max(50, "Genre name must be less than 50 characters")
    .trim()
})

type GenreFormData = z.infer<typeof genreSchema>

interface EditGenreDialogProps {
  genre: Genre
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditGenreDialog({ genre, open, onOpenChange }: EditGenreDialogProps) {
  const updateGenre = useUpdateGenre()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<GenreFormData>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: genre.name
    }
  })

  // Reset form when genre changes
  useEffect(() => {
    reset({ name: genre.name })
  }, [genre, reset])

  const onSubmit = (data: GenreFormData) => {
    updateGenre.mutate(
      { id: genre.id, name: data.name },
      {
        onSuccess: (result) => {
          if (result.success) {
            onOpenChange(false)
          }
        }
      }
    )
  }

  const handleClose = () => {
    if (!updateGenre.isPending) {
      reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-foreground">
            Edit Genre
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update the genre name
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="font-poppins font-bold text-foreground">
              Genre Name
            </Label>
            <Input
              id="edit-name"
              placeholder="e.g., Science Fiction"
              className="bg-input border-border text-foreground"
              autoComplete="off"
              {...register("name")}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "edit-name-error" : undefined}
            />
            {errors.name && (
              <p id="edit-name-error" className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateGenre.isPending}
              className="border-border w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateGenre.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              {updateGenre.isPending ? "Updating..." : "Update Genre"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}