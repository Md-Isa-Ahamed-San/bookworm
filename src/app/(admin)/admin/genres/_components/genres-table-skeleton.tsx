import { Skeleton } from "~/components/ui/skeleton"
import { Card } from "~/components/ui/card"

export function GenresTableSkeleton() {
  return (
    <Card className="bg-card border-border">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}