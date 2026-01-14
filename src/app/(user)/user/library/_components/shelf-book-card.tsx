"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MoreVertical, Trash2, MoveRight } from "lucide-react"
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Progress } from "~/components/ui/progress"
import type { ShelfType } from "../../../../../../generated/prisma"
import { useRemoveFromShelf } from "../../../../../hooks/books/shelf/use-remove-from-shelf"
import { ConfirmationDialog } from "../../../../../components/confirmation-dialog"
import { MoveToShelfDialog } from "./move-to-shelf-dialog"
import { UpdateProgressDialog } from "./update-progress-dialog"


interface ShelfBookCardProps {
  userBook: any
  shelf: ShelfType
}

export function ShelfBookCard({ userBook, shelf }: ShelfBookCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [showProgressDialog, setShowProgressDialog] = useState(false)
  
  const removeFromShelf = useRemoveFromShelf()
  const { book } = userBook

  // Calculate percentage from pages read
  const pagesRead = userBook.progress
  const totalPages = book.totalPages || 0
  const progressPercentage = totalPages > 0 
    ? Math.min(Math.round((pagesRead / totalPages) * 100), 100)
    : 0

  const handleRemove = () => {
    removeFromShelf.mutate(userBook.id, {
      onSuccess: () => setShowDeleteConfirm(false)
    })
  }

  return (
    <>
      <Card className="group bg-card border-border overflow-hidden hover:shadow-lg transition-shadow">
        {/* Book Cover */}
        <Link href={`/user/books/${book.id}`} className="block relative aspect-[2/3] overflow-hidden">
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          />
        </Link>

        {/* Book Info */}
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/user/books/${book.id}`} className="flex-1 min-w-0">
              <h3 className="font-poppins font-bold text-sm text-foreground line-clamp-2 hover:text-primary transition-colors">
                {book.title}
              </h3>
            </Link>
            
            {/* Actions Menu - Icon Only */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  aria-label="More options"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                <DropdownMenuItem
                  onClick={() => setShowMoveDialog(true)}
                  className="cursor-pointer"
                >
                  <MoveRight className="h-4 w-4 mr-2" />
                  Move to Shelf
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove from Library
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-1">
            {book.author}
          </p>

          {/* Progress Bar (Only for Currently Reading) */}
          {shelf === "CURRENTLY_READING" && (
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">
                  {totalPages > 0 
                    ? `${pagesRead} / ${totalPages} pages`
                    : `${progressPercentage}%`
                  }
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowProgressDialog(true)}
                className="w-full text-xs border-border hover:bg-accent"
              >
                Update Progress
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Dialogs */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleRemove}
        title="Remove from Library"
        description={`Are you sure you want to remove "${book.title}" from your library?`}
        confirmText="Remove"
        isDestructive={true}
      />

      <MoveToShelfDialog
        open={showMoveDialog}
        onOpenChange={setShowMoveDialog}
        userBook={userBook}
        currentShelf={shelf}
      />

      {shelf === "CURRENTLY_READING" && (
        <UpdateProgressDialog
          open={showProgressDialog}
          onOpenChange={setShowProgressDialog}
          userBook={userBook}
        />
      )}
    </>
  )
}