import { Skeleton } from "~/components/ui/skeleton"
import { Card } from "~/components/ui/card"

export function LibrarySkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b border-border">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="bg-card border-border p-0 overflow-hidden">
            <Skeleton className="aspect-[2/3] w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}