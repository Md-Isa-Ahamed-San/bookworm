import Link from "next/link"
import { BookOpen, Search } from "lucide-react"
import { Button } from "~/components/ui/button"
import type { ShelfType } from "../../../../../../generated/prisma"


export function EmptyShelfState({ shelf }: { shelf: ShelfType }) {
  const content = {
    WANT_TO_READ: {
      title: "Your reading list is empty",
      description: "Find books you want to read and add them to your list.",
    },
    CURRENTLY_READING: {
      title: "Not reading anything?",
      description: "Start tracking your progress on a book you're reading.",
    },
    READ: {
      title: "No books finished yet",
      description: "Books you finish reading will appear here.",
    },
  }

  const { title, description } = content[shelf]

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/60 rounded-lg bg-card/30">
      <div className="bg-muted/50 p-4 rounded-full mb-4">
        <BookOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold font-poppins text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      <Button asChild>
        <Link href="/browse">
          <Search className="mr-2 h-4 w-4" />
          Browse Books
        </Link>
      </Button>
    </div>
  )
}