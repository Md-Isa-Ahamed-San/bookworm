"use client"

import { useState, useEffect } from "react"
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
import { useUpdateProgress } from "../../../../../hooks/books/shelf/use-update-progress"


interface UpdateProgressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userBook: any
}

export function UpdateProgressDialog({
  open,
  onOpenChange,
  userBook,
}: UpdateProgressDialogProps) {
  const updateProgress = useUpdateProgress()
  const totalPages = userBook.book.totalPages || 0
  const currentPagesRead = userBook.progress

  // Dynamic schema based on whether book has totalPages
  const progressSchema = z.object({
    pagesRead: totalPages > 0
      ? z.coerce
          .number()
          .min(0, "Pages cannot be negative")
          .max(totalPages, `Cannot exceed ${totalPages} pages`)
      : z.coerce.number().min(0, "Pages cannot be negative"),
  })

  type ProgressFormData = z.infer<typeof progressSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      pagesRead: currentPagesRead,
    },
  })

  const currentPages = watch("pagesRead")
  const progressPercentage = totalPages > 0 
    ? Math.min(Math.round((currentPages / totalPages) * 100), 100)
    : 0

  useEffect(() => {
    reset({ pagesRead: currentPagesRead })
  }, [currentPagesRead, reset])

  const onSubmit = (data: ProgressFormData) => {
    updateProgress.mutate(
      { 
        userBookId: userBook.id, 
        progress: data.pagesRead // Store pages read, not percentage
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            onOpenChange(false)
          }
        },
      }
    )
  }

  const handleClose = () => {
    if (!updateProgress.isPending) {
      reset()
      onOpenChange(false)
    }
  }

  // Quick progress buttons - calculate pages from percentages
  const setQuickProgress = (percentage: number) => {
    if (totalPages > 0) {
      const pages = Math.round((percentage / 100) * totalPages)
      setValue("pagesRead", pages)
    } else {
      // If no totalPages, treat it as percentage directly
      setValue("pagesRead", percentage)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-foreground">
            Update Reading Progress
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            How many pages of &quot;{userBook.book.title}&quot; have you read?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Input - Pages Read */}
          <div className="space-y-2">
            <Label htmlFor="pagesRead" className="font-poppins font-bold text-foreground">
              Pages Read
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="pagesRead"
                type="number"
                min="0"
                max={totalPages || undefined}
                placeholder="0"
                className="bg-input border-border text-foreground text-lg font-medium"
                {...register("pagesRead")}
                disabled={updateProgress.isPending}
                autoFocus
              />
              {totalPages > 0 && (
                <span className="text-muted-foreground whitespace-nowrap">
                  / {totalPages}
                </span>
              )}
            </div>
            {errors.pagesRead && (
              <p className="text-sm text-destructive">{errors.pagesRead.message}</p>
            )}
            
            {/* Progress Percentage Display */}
            {totalPages > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-muted-foreground font-medium min-w-[3rem] text-right">
                  {progressPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions - Only if totalPages exists */}
          {totalPages > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Quick Set</Label>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((percentage) => (
                  <Button
                    key={percentage}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickProgress(percentage)}
                    disabled={updateProgress.isPending}
                    className="border-border flex flex-col py-2 h-auto"
                  >
                    <span className="text-xs font-bold">{percentage}%</span>
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round((percentage / 100) * totalPages)}p
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateProgress.isPending}
              className="border-border w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProgress.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              {updateProgress.isPending ? "Updating..." : "Update Progress"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}