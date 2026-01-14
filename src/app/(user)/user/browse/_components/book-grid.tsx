import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent } from "~/components/ui/card"

interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  avgRating: number
  genre: { name: string }
  _count: { reviews: number }
}

interface BookGridProps {
  books: Book[]
}

export function BookGrid({ books }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-lg border-border/60 bg-card/50">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-lg font-semibold text-foreground">No books found</h3>
        <p className="text-muted-foreground max-w-sm mt-2">
          We couldn&apos;t find any books matching your search. Try adjusting your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {books.map((book) => (
        <Link key={book.id} href={`/user/books/${book.id}`} className="group block h-full">
          <Card className="h-full overflow-hidden bg-card border-0 shadow-sm transition-all duration-300 hover:shadow-lg p-0">
            {/* Book cover with subtle overlay */}
            <div className="relative aspect-2/3 w-full overflow-hidden bg-muted/30">
              <Image
                src={book.coverUrl || "/placeholder-book.jpg"}
                alt={book.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Genre badge */}
              <div className="absolute top-3 left-3">
                <Badge
                  variant="secondary"
                  className="text-xs font-medium bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white"
                >
                  {book.genre.name}
                </Badge>
              </div>
            </div>

            {/* Book info section */}
            <CardContent className="space-y-3">
              {/* Title with better typography */}
              <div>
                <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {book.title}
                </h3>
              </div>

              {/* Author - muted */}
              <p className="text-xs text-muted-foreground line-clamp-1 font-medium">{book.author}</p>

              {/* Rating footer with refined styling */}
              <div className="flex items-center gap-2 py-2 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-foreground">{book.avgRating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">({book._count.reviews})</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
