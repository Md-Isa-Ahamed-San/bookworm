// ==========================================
// 📁 src/app/(user)/dashboard/_components/recent-activity.tsx
// ==========================================
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Book, Review } from "../../../../../../generated/prisma";
import { StarRating } from "../../../../../components/star-rating";


interface RecentActivityProps {
  reviews: (Review & {
    book: Pick<Book, "id" | "title" | "coverUrl">;
  })[];
}

export function RecentActivity({ reviews }: RecentActivityProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle className="font-poppins text-xl font-bold">
            Recent Activity
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <Link
              key={review.id}
              href={`/user/books/${review.book.id}`}
              className="flex items-center gap-4 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-accent"
            >
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
                <Image
                  src={review.book.coverUrl}
                  alt={review.book.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  You reviewed <span className="font-semibold">{review.book.title}</span>
                </p>
                <StarRating rating={review.rating} readonly size="sm" />
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {review.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}