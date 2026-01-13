// ==========================================
// 📁 src/components/book-card.tsx
// ==========================================
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, BookOpen } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    genre?: {
      name: string;
    };
    avgRating?: number;
    _count?: {
      userBooks: number;
    };
  };
  showGenre?: boolean;
  showStats?: boolean;
}

export function BookCard({
  book,
  showGenre = true,
  showStats = false,
}: BookCardProps) {
  return (
    <Link href={`/user/books/${book.id}`}>
      <Card className="group overflow-hidden border-border bg-card transition-all hover:shadow-lg hover:scale-[1.02]">
        <CardContent className="p-0">
          {/* Book Cover */}
          <div className="relative aspect-[2/3] overflow-hidden bg-muted">
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {showGenre && book.genre && (
              <Badge className="absolute left-2 top-2 bg-primary/90 text-primary-foreground backdrop-blur">
                {book.genre.name}
              </Badge>
            )}
          </div>

          {/* Book Info */}
          <div className="p-4 space-y-2">
            <h3 className="font-poppins font-bold text-sm leading-tight line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-muted-foreground">{book.author}</p>

            {/* Stats */}
            {showStats && (
              <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                {book.avgRating !== undefined && book.avgRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{book.avgRating.toFixed(1)}</span>
                  </div>
                )}
                {book._count?.userBooks !== undefined && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{book._count.userBooks}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
