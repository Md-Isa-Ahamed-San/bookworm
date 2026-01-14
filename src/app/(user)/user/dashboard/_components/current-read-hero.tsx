
// ==========================================
// 📁 src/app/(user)/dashboard/_components/current-read-hero.tsx
// ==========================================
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
import { BookOpen } from "lucide-react";
import type { Book, Genre, UserBook } from "../../../../../../generated/prisma";

interface CurrentReadHeroProps {
  currentReading: UserBook & {
    book: Book & {
      genre: Genre;
    };
  };
}

export function CurrentReadHero({ currentReading }: CurrentReadHeroProps) {
  const { book, progress } = currentReading;

  return (
    <Card className="overflow-hidden border-border bg-linear-to-br from-primary/5 to-accent/5">
      <CardContent className="p-0">
        <div className="grid gap-6 md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr]">
          {/* Book Cover */}
          <div className="relative aspect-2/3 md:aspect-auto">
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          {/* Book Info */}
          <div className="flex flex-col justify-center space-y-4 p-6 md:p-8">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>Currently Reading</span>
            </div>

            <div>
              <h2 className="font-poppins text-2xl font-bold text-card-foreground md:text-3xl">
                {book.title}
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                by {book.author}
              </p>
              <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {book.genre.name}
              </span>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-poppins font-bold text-primary">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <Link href={`/user/books/${book.id}`}>
              <Button className="w-full md:w-auto">Continue Reading →</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}