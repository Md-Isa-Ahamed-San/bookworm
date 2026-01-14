"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Star } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { submitReview } from "~/actions/review-actions"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  text: z.string().min(10, "Review must be at least 10 characters"),
})

export function ReviewForm({ bookId }: { bookId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { rating: 0, text: "" }
  })

  const currentRating = watch("rating")

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    const result = await submitReview({ bookId, ...data })
    setIsSubmitting(false)

    if (result.success) {
      toast.success("Review submitted for approval!")
      reset()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg font-poppins">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Star Rating Input */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setValue("rating", star, { shouldValidate: true })}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoverRating || currentRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/40"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-sm text-destructive">Please select a rating</p>}

          <Textarea
            placeholder="Share your thoughts on this book..."
            className="min-h-[100px] bg-background"
            {...register("text")}
          />
          {errors.text && <p className="text-sm text-destructive">{errors.text.message}</p>}

          <Button type="submit" disabled={isSubmitting || currentRating === 0}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}