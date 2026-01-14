"use client"

import { useState, useTransition } from "react"
import { Check, ChevronDown, BookOpen, BookPlus, BookCheck } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { updateBookShelf } from "~/actions/shelf-actions"
import { toast } from "sonner"
import type { ShelfType } from "../../../../../../../generated/prisma"


interface ShelfSelectorProps {
  bookId: string
  currentShelf: ShelfType | null
}

export function ShelfSelector({ bookId, currentShelf }: ShelfSelectorProps) {
  const [shelf, setShelf] = useState<ShelfType | null>(currentShelf)
  const [isPending, startTransition] = useTransition()

  const handleShelfChange = (newShelf: ShelfType) => {
    // Optimistic Update
    const prevShelf = shelf
    setShelf(newShelf)

    startTransition(async () => {
      const result = await updateBookShelf({ bookId, shelf: newShelf })
      if (!result.success) {
        setShelf(prevShelf) // Rollback
        toast.error(result.error)
      } else {
        toast.success(`Added to ${newShelf.replace(/_/g, " ")}`)
      }
    })
  }

  const getLabel = () => {
    switch (shelf) {
      case "WANT_TO_READ": return "Want to Read"
      case "CURRENTLY_READING": return "Currently Reading"
      case "READ": return "Read"
      default: return "Add to Shelf"
    }
  }

  const getIcon = () => {
    switch (shelf) {
      case "WANT_TO_READ": return <BookPlus className="mr-2 h-4 w-4" />
      case "CURRENTLY_READING": return <BookOpen className="mr-2 h-4 w-4" />
      case "READ": return <BookCheck className="mr-2 h-4 w-4" />
      default: return <BookPlus className="mr-2 h-4 w-4" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={shelf ? "default" : "outline"} 
          className="w-full md:w-[200px] transition-all"
          disabled={isPending}
        >
          {getIcon()}
          {getLabel()}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={() => handleShelfChange("WANT_TO_READ")}>
          Want to Read
          {shelf === "WANT_TO_READ" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShelfChange("CURRENTLY_READING")}>
          Currently Reading
          {shelf === "CURRENTLY_READING" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShelfChange("READ")}>
          Read
          {shelf === "READ" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}