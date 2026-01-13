"use client"

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
import { useCreateGenre } from "../../../../../hooks/genre/use-create-genre"


const genreSchema = z.object({
  name: z.string()
    .min(2, "Genre name must be at least 2 characters")
    .max(50, "Genre name must be less than 50 characters")
    .trim()
})

type GenreFormData = z.infer<typeof genreSchema>

interface AddGenreDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddGenreDialog({ open, onOpenChange }: AddGenreDialogProps) {
  const createGenre = useCreateGenre()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<GenreFormData>({
    resolver: zodResolver(genreSchema)
  })

  const onSubmit = (data: GenreFormData) => {
    createGenre.mutate(data.name, {
      onSuccess: (result) => {
        if (result.success) {
          reset()
          onOpenChange(false)
        }
      }
    })
  }

  const handleClose = () => {
    if (!createGenre.isPending) {
      reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-foreground">
            Add New Genre
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new genre for organizing books
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-poppins font-bold text-foreground">
              Genre Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Science Fiction"
              className="bg-input border-border text-foreground"
              autoComplete="off"
              {...register("name")}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createGenre.isPending}
              className="border-border w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createGenre.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              {createGenre.isPending ? "Creating..." : "Create Genre"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}