"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveReview } from "~/actions/review-actions";
import { toast } from "sonner";

export function useApproveReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => approveReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review-counts"] });
      toast.success("Review approved");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve review");
    },
  });
}