// ==========================================
// 📁 src/components/shared/star-rating.tsx
// ==========================================
"use client";

import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
      {stars.map((star) => {
        const isFilled = star <= rating;
        return (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange?.(star)}
            disabled={readonly}
            className={cn(
              "transition-colors",
              !readonly && "cursor-pointer hover:scale-110",
              readonly && "cursor-default"
            )}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}