// ==========================================
// 📁 src/app/(user)/dashboard/_components/recommendations-section.tsx
// ==========================================
"use client";


import { Sparkles } from "lucide-react";
import type { Book, Genre } from "../../../../../../generated/prisma";
import { BookCard } from "../../../../../components/book-card";


interface RecommendationsSectionProps {
  recommendations: (Book & {
    genre: Genre;
    avgRating: number;
  })[];
  genreName: string;
}

export function RecommendationsSection({
  recommendations,
  genreName,
}: RecommendationsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-poppins text-2xl font-bold text-foreground">
          Recommended for You
        </h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Because you love {genreName}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {recommendations.map((book) => (
          <BookCard key={book.id} book={book} showGenre showStats />
        ))}
      </div>
    </section>
  );
}