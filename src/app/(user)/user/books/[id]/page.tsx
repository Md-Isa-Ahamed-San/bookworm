import { notFound } from "next/navigation"

import { getBookDetails, getUserBookStatus } from "~/queries/book-details-queries"
import { BookHero } from "./_components/book-hero"
import { ReviewForm } from "./_components/review-form"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Card, CardContent } from "~/components/ui/card"
import { Star } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { getSession } from "../../../../../server/better-auth/server"

interface BookDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function BookDetailsPage({ params }: BookDetailsPageProps) {
  const { id } = await params
  const session = await getSession()
  
  // Fetch data in parallel
  const [book, userStatus] = await Promise.all([
    getBookDetails(id),
    session ? getUserBookStatus(session.user.id, id) : Promise.resolve(null)
  ])

  if (!book) return notFound()

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 max-w-5xl">
      {/* Hero Section */}
      <BookHero book={book} userShelf={userStatus?.shelf || null} />

      <hr className="border-border/40" />

      {/* Reviews Section */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Review List */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold font-poppins">Community Reviews</h2>
          
          {book.reviews.length === 0 ? (
            <p className="text-muted-foreground italic">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {book.reviews.map((review) => (
                <Card key={review.id} className="border-border/40 bg-card/30">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.user.image || ""} />
                          <AvatarFallback>{review.user.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{review.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {review.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Review Form Sidebar */}
        <div className="md:col-span-1">
          {session ? (
            userStatus?.hasReviewed ? (
              <Card className="bg-muted/30 border-border/40">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-2xl">✨</div>
                  <h3 className="font-semibold">Thanks for reviewing!</h3>
                  <p className="text-sm text-muted-foreground">
                    {userStatus.reviewStatus === "PENDING" 
                      ? "Your review is pending approval." 
                      : "Your review is live."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ReviewForm bookId={book.id} />
            )
          ) : (
            <Card className="bg-muted/30 border-border/40">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Please log in to write a review.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}