// ==========================================
// 📁 src/components/book-card-skeleton.tsx
// ==========================================
import { Card, CardContent } from "~/components/ui/card";

export function BookCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className="p-0">
        {/* Cover Skeleton */}
        <div className="aspect-2/3 animate-pulse bg-muted" />

        {/* Info Skeleton */}
        <div className="p-4 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}