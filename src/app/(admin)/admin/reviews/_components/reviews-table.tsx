"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "~/components/ui/card";

import { PaginationControls } from "~/app/(admin)/admin/books/_components/pagination-controls";
import { ConfirmationDialog } from "~/components/confirmation-dialog";
import { useReviews, useReviewCounts } from "~/hooks/review/use-reviews";
import { useDeleteReview } from "~/hooks/review/use-delete-review";
import type { ReviewStatus } from "../../../../../../generated/prisma";
import { ReviewRow } from "./review-row";
import { StatusTabs } from "./status-tabs";


type ReviewWithRelations = {
  id: string;
  rating: number;
  text: string;
  status: ReviewStatus;
  createdAt: Date;
  user: { id: string; name: string; image: string | null };
  book: { id: string; title: string; author: string; coverUrl: string };
};

export function ReviewsTable() {
  const [selectedStatus, setSelectedStatus] = useState<ReviewStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [deletingReview, setDeletingReview] = useState<ReviewWithRelations | null>(null);

  const { data: counts } = useReviewCounts();
  const { data, isLoading, isFetching, isError, error } = useReviews({
    status: selectedStatus === "ALL" ? undefined : selectedStatus,
    page,
    limit: 10,
  });

  const deleteReview = useDeleteReview();

  const handleDelete = () => {
    if (deletingReview) {
      deleteReview.mutate(deletingReview.id, {
        onSuccess: () => setDeletingReview(null),
      });
    }
  };

  const handleStatusChange = (status: ReviewStatus | "ALL") => {
    setSelectedStatus(status);
    setPage(1); // Reset to first page
  };

  const { reviews, pagination } = data || { reviews: [], pagination: null };

  return (
    <>
      <Card className="bg-card border-border">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-poppins font-bold text-foreground">
              All Reviews
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {pagination?.total || 0} review(s) total
            </p>
          </div>

          {/* Status Tabs */}
          <StatusTabs
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            counts={counts}
          />

          {/* Results */}
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground text-sm">Loading reviews...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 border border-dashed border-destructive/50 rounded-lg">
              <p className="text-destructive font-medium mb-2">Failed to load reviews</p>
              <p className="text-muted-foreground text-sm">{error?.message}</p>
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-foreground font-medium mb-2">No reviews found</p>
              <p className="text-muted-foreground text-sm">
                {selectedStatus === "PENDING"
                  ? "All reviews have been moderated"
                  : "No reviews in this category"}
              </p>
            </div>
          ) : (
            <div className={`space-y-4 transition-opacity ${isFetching ? "opacity-50" : "opacity-100"}`}>
              {reviews.map((review) => (
                <ReviewRow
                  key={review.id}
                  review={review}
                  onDelete={() => setDeletingReview(review)}
                />
              ))}

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6">
                  <PaginationControls
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <ConfirmationDialog
        open={!!deletingReview}
        onOpenChange={(open) => !open && setDeletingReview(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        description={
          deletingReview
            ? `Are you sure you want to delete this review from "${deletingReview.user.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        isDestructive={true}
      />
    </>
  );
}