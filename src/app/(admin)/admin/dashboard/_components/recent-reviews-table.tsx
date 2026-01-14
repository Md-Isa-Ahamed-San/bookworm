// src/app/(admin)/dashboard/_components/recent-reviews-table.tsx
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Star } from "lucide-react"

interface RecentReviewsTableProps {
  reviews: {
    id: string
    bookTitle: string
    userName: string
    rating: number
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: Date
  }[]
}

export function RecentReviewsTable({ reviews }: RecentReviewsTableProps) {
  return (
    <Card className="col-span-4 lg:col-span-2 border-border/40 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b-border/40 hover:bg-transparent">
              <TableHead className="w-[40%]">Book</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow className="border-b-border/40">
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow 
                  key={review.id} 
                  // FIX: Lighter border color and remove border for the last item
                  className="border-b-border/40 last:border-0 hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    <span className="line-clamp-1" title={review.bookTitle}>
                      {review.bookTitle}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-1 text-muted-foreground">
                      {review.userName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{review.rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        review.status === "APPROVED"
                          ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                          : review.status === "PENDING"
                          ? "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400"
                          : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
                      }
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}