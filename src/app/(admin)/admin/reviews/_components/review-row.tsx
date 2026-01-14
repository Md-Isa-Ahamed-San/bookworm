"use client";

import Image from "next/image";
import { Check, X, Trash2, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useApproveReview } from "~/hooks/review/use-approve-review";
import { useRejectReview } from "~/hooks/review/use-reject-review";
import type { ReviewStatus } from "../../../../../../generated/prisma";


type ReviewWithRelations = {
  id: string;
  rating: number;
  text: string;
  status: ReviewStatus;
  createdAt: Date;
  user: { id: string; name: string; image: string | null };
  book: { id: string; title: string; author: string; coverUrl: string };
};

export function ReviewRow({
  review,
  onDelete,
}: {
  review: ReviewWithRelations;
  onDelete: () => void;
}) {
  const approveReview = useApproveReview();
  const rejectReview = useRejectReview();

  const isPending = approveReview.isPending || rejectReview.isPending;

  return (
    <div className="border border-border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Book Info */}
        <div className="flex gap-3 flex-1">
          <div className="relative h-16 w-12 rounded overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={review.book.coverUrl}
              alt={review.book.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-poppins font-bold text-foreground truncate">
              {review.book.title}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              by {review.book.author}
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted">
            {review.user.image ? (
              <Image
                src={review.user.image}
                alt={review.user.name}
                fill
                className="object-cover"
                sizes="32px"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-xs font-bold">
                {review.user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{review.user.name}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {review.rating}/5
        </span>
      </div>

      {/* Review Text */}
      <p className="text-sm text-foreground mt-2 line-clamp-3">{review.text}</p>

      {/* Status Badge & Actions */}
      <div className="flex items-center justify-between mt-4 gap-3">
        <Badge
          variant={
            review.status === "APPROVED"
              ? "default"
              : review.status === "REJECTED"
                ? "destructive"
                : "secondary"
          }
          className={review.status === "PENDING" ? "bg-yellow-500" : ""}
        >
          {review.status}
        </Badge>

        <div className="flex gap-2">
          {review.status === "PENDING" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => approveReview.mutate(review.id)}
                disabled={isPending}
                className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => rejectReview.mutate(review.id)}
                disabled={isPending}
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            disabled={isPending}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}