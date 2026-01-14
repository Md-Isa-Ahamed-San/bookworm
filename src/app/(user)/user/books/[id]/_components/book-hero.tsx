import { Star } from "lucide-react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import type { ShelfType } from "../../../../../../../generated/prisma";
import { ShelfSelector } from "./shelf-selector";

interface BookHeroProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    description: string;
    avgRating: number;
    genre: { name: string };
    _count: { reviews: number };
  };
  userShelf: ShelfType | null;
}

export function BookHero({ book, userShelf }: BookHeroProps) {
  //console..log("book-hero",book)
  return (
    <div className="flex flex-col gap-8 md:flex-row">
      {/* Cover Image */}
      <div className="border-border/40 relative aspect-2/3 w-full shrink-0 overflow-hidden rounded-lg border shadow-lg md:w-75">
        <Image
          src={book.coverUrl || "/placeholder-book.jpg"}
          alt={book.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Details */}
      <div className="flex w-full flex-col justify-start space-y-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">
            {book.genre.name}
          </Badge>
          <h1 className="font-poppins text-foreground text-3xl font-bold md:text-4xl">
            {book.title}
          </h1>
          <p className="text-muted-foreground text-xl font-medium">
            by {book.author}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(book.avgRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-bold">{book.avgRating.toFixed(1)}</span>
          <span className="text-muted-foreground">
            ({book._count.reviews} reviews)
          </span>
        </div>

        <div className="py-4">
          <ShelfSelector bookId={book.id} currentShelf={userShelf} />
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h3 className="mb-2 text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {book.description}
          </p>
        </div>
      </div>
    </div>
  );
}
