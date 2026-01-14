"use client"

import { BookOpen, Clock, CheckCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import type { ShelfType } from "../../../../../../generated/prisma"
import { useMoveToShelf } from "../../../../../hooks/books/shelf/use-move-to-shelf"


interface MoveToShelfDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userBook: any
  currentShelf: ShelfType
}

const shelves = [
  {
    value: "WANT_TO_READ" as ShelfType,
    label: "Want to Read",
    icon: BookOpen,
    description: "Save for later",
  },
  {
    value: "CURRENTLY_READING" as ShelfType,
    label: "Currently Reading",
    icon: Clock,
    description: "Track your progress",
  },
  {
    value: "READ" as ShelfType,
    label: "Read",
    icon: CheckCircle,
    description: "Mark as finished",
  },
]

export function MoveToShelfDialog({
  open,
  onOpenChange,
  userBook,
  currentShelf,
}: MoveToShelfDialogProps) {
  const moveToShelf = useMoveToShelf()

  const handleMove = (shelf: ShelfType) => {
    moveToShelf.mutate(
      { userBookId: userBook.id, shelf },
      {
        onSuccess: (result) => {
          if (result.success) {
            onOpenChange(false)
          }
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-foreground">
            Move to Shelf
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose which shelf to move &quot;{userBook.book.title}&quot; to
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {shelves.map((shelf) => {
            const Icon = shelf.icon
            const isCurrent = shelf.value === currentShelf
            const isDisabled = moveToShelf.isPending

            return (
              <Button
                key={shelf.value}
                onClick={() => handleMove(shelf.value)}
                disabled={isCurrent || isDisabled}
                variant={isCurrent ? "default" : "outline"}
                className={`
                  w-full justify-start h-auto py-3 px-4
                  ${isCurrent ? "bg-primary text-primary-foreground" : "border-border"}
                `}
              >
                <Icon className="h-5 w-5 mr-3 shrink-0" />
                <div className="text-left">
                  <p className="font-medium">{shelf.label}</p>
                  <p className="text-xs opacity-80">{shelf.description}</p>
                </div>
                {isCurrent && (
                  <span className="ml-auto text-xs">Current</span>
                )}
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}