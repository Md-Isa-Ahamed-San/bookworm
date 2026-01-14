import { Skeleton } from "~/components/ui/skeleton"
import { Card } from "~/components/ui/card"

export function ShelfBookGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i} className="bg-card border-border overflow-hidden h-full">
          {/* Cover Skeleton */}
          <div className="aspect-[2/3] w-full bg-muted relative">
            <Skeleton className="h-full w-full" />
          </div>
          
          {/* Content Skeleton */}
          <div className="p-3 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            
            {/* Progress Bar Skeleton */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <Skeleton className="h-2 w-12" />
                <Skeleton className="h-2 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}