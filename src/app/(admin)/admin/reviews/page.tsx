import { ReviewsTable } from "./_components/reviews-table";

export default function ModerateReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground">
          Moderate Reviews
        </h1>
        <p className="text-muted-foreground mt-2">
          Approve, reject, or delete user reviews
        </p>
      </div>

      <ReviewsTable />
    </div>
  );
}