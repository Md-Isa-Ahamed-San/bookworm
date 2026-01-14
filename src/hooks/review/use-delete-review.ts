"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "~/actions/review-actions";
import { toast } from "sonner";

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review-counts"] });
      toast.success("Review deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });
}